<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\DashboardStatsResource;
use App\Models\Contact;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Projects;
use App\Models\Service;
use App\Models\Skills;
use App\Models\Testimonial;
use App\Models\UserSkill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics based on user type.
     */
    public function stats(Request $request)
    {
        $user = $request->user();
        $cacheKey = 'dashboard:stats:' . $user->id;

        $stats = Cache::remember($cacheKey, 600, function () use ($user) {
            // Load user with user_type relationship
            $user->load('userType');
            
            $userTypeSlug = $user->userType?->slug ?? 'professional';

            // Return stats based on user type
            return match($userTypeSlug) {
                'student' => $this->getStudentStats($user),
                'teacher' => $this->getTeacherStats($user),
                'professional' => $this->getDeveloperStats($user),
                'freelancer' => $this->getFreelancerStats($user),
                default => $this->getGenericStats($user),
            };
        });

        return response()->json([
            'success' => true,
            'data' => new DashboardStatsResource($stats),
        ]);
    }

    /**
     * Get stats for student users.
     */
    private function getStudentStats($user)
    {
        $userId = $user->id;

        // Get GPA from user field values
        $gpa = DB::table('user_field_values')
            ->join('user_type_fields', 'user_field_values.user_type_field_id', '=', 'user_type_fields.id')
            ->where('user_field_values.user_id', $userId)
            ->where('user_type_fields.field_slug', 'gpa')
            ->value('user_field_values.value');

        // Get current semester
        $currentSemester = DB::table('user_field_values')
            ->join('user_type_fields', 'user_field_values.user_type_field_id', '=', 'user_type_fields.id')
            ->where('user_field_values.user_id', $userId)
            ->where('user_type_fields.field_slug', 'current_semester')
            ->value('user_field_values.value');

        return [
            'courses' => [
                'total' => Education::where('user_id', $userId)
                    ->where('role', 'student')
                    ->count(),
                'current_semester' => $currentSemester ?? 'N/A',
                'in_progress' => Education::where('user_id', $userId)
                    ->where('role', 'student')
                    ->where('is_current', true)
                    ->count(),
            ],
            'assignments' => [
                'total' => Projects::where('user_id', $userId)
                    ->whereIn('type', ['assignment', 'academic_project'])
                    ->count(),
                'completed' => Projects::where('user_id', $userId)
                    ->whereIn('type', ['assignment', 'academic_project'])
                    ->where('status', 'published')
                    ->count(),
                'pending' => Projects::where('user_id', $userId)
                    ->whereIn('type', ['assignment', 'academic_project'])
                    ->where('status', 'draft')
                    ->count(),
            ],
            'academic_performance' => [
                'gpa' => $gpa ? floatval($gpa) : null,
                'research_papers' => Projects::where('user_id', $userId)
                    ->where('type', 'research_paper')
                    ->count(),
            ],
            'projects' => [
                'total' => Projects::where('user_id', $userId)
                    ->where('type', 'personal_project')
                    ->count(),
                'featured' => Projects::where('user_id', $userId)
                    ->where('type', 'personal_project')
                    ->where('featured', true)
                    ->count(),
            ],
            'skills' => [
                'total' => UserSkill::where('user_id', $userId)->count(),
                'by_proficiency' => UserSkill::where('user_id', $userId)
                    ->select('proficiency', DB::raw('count(*) as count'))
                    ->groupBy('proficiency')
                    ->pluck('count', 'proficiency'),
            ],
        ];
    }

    /**
     * Get stats for teacher users.
     */
    private function getTeacherStats($user)
    {
        $userId = $user->id;

        // Get teaching-related field values
        $teachingSubjects = DB::table('user_field_values')
            ->join('user_type_fields', 'user_field_values.user_type_field_id', '=', 'user_type_fields.id')
            ->where('user_field_values.user_id', $userId)
            ->where('user_type_fields.field_slug', 'teaching_subjects')
            ->value('user_field_values.value');

        return [
            'classes' => [
                'total' => Education::where('user_id', $userId)
                    ->where('role', 'teacher')
                    ->count(),
                'active' => Education::where('user_id', $userId)
                    ->where('role', 'teacher')
                    ->where('is_current', true)
                    ->count(),
                'subjects' => $teachingSubjects ? explode(',', $teachingSubjects) : [],
            ],
            'students' => [
                'total' => Contact::where('status', '!=', 'spam')->count(), // Approximate
                'active_inquiries' => Contact::where('status', 'unread')->count(),
            ],
            'materials' => [
                'total' => Projects::where('user_id', $userId)
                    ->whereIn('type', ['academic_project', 'research_paper'])
                    ->count(),
                'published' => Projects::where('user_id', $userId)
                    ->whereIn('type', ['academic_project', 'research_paper'])
                    ->where('status', 'published')
                    ->count(),
                'research_papers' => Projects::where('user_id', $userId)
                    ->where('type', 'research_paper')
                    ->count(),
            ],
            'ratings' => [
                'testimonials' => Testimonial::where('user_id', $userId)->count(),
                'featured' => Testimonial::where('user_id', $userId)
                    ->where('featured', true)
                    ->count(),
                'average_rating' => Testimonial::where('user_id', $userId)
                    ->avg('rating') ?? 0,
            ],
            'experience' => [
                'total_positions' => Education::where('user_id', $userId)
                    ->where('role', 'teacher')
                    ->count(),
                'years_teaching' => Education::where('user_id', $userId)
                    ->where('role', 'teacher')
                    ->whereNotNull('start_date')
                    ->get()
                    ->sum(function ($edu) {
                        $start = \Carbon\Carbon::parse($edu->start_date);
                        $end = $edu->end_date ? \Carbon\Carbon::parse($edu->end_date) : now();
                        return $start->diffInYears($end);
                    }),
            ],
        ];
    }

    /**
     * Get stats for professional/developer users.
     */
    private function getDeveloperStats($user)
    {
        $userId = $user->id;

        return [
            'projects' => [
                'total' => Projects::where('user_id', $userId)->count(),
                'published' => Projects::where('user_id', $userId)
                    ->where('status', 'published')
                    ->count(),
                'draft' => Projects::where('user_id', $userId)
                    ->where('status', 'draft')
                    ->count(),
                'featured' => Projects::where('user_id', $userId)
                    ->where('featured', true)
                    ->count(),
                'by_type' => Projects::where('user_id', $userId)
                    ->select('type', DB::raw('count(*) as count'))
                    ->groupBy('type')
                    ->pluck('count', 'type'),
            ],
            'contributions' => [
                'total_projects' => Projects::where('user_id', $userId)
                    ->where('type', 'professional_project')
                    ->count(),
                'open_source' => Projects::where('user_id', $userId)
                    ->where('type', 'personal_project')
                    ->count(),
            ],
            'tech_stack' => [
                'total_skills' => UserSkill::where('user_id', $userId)->count(),
                'by_proficiency' => UserSkill::where('user_id', $userId)
                    ->select('proficiency', DB::raw('count(*) as count'))
                    ->groupBy('proficiency')
                    ->pluck('count', 'proficiency'),
                'top_skills' => UserSkill::where('user_id', $userId)
                    ->join('skills', 'user_skills.skill_id', '=', 'skills.id')
                    ->orderByDesc('user_skills.years_experience')
                    ->limit(5)
                    ->pluck('skills.name'),
            ],
            'experience' => [
                'total' => Experience::where('user_id', $userId)->count(),
                'current' => Experience::where('user_id', $userId)
                    ->where('is_current', true)
                    ->count(),
                'years' => Experience::where('user_id', $userId)
                    ->whereNotNull('start_date')
                    ->get()
                    ->sum(function ($exp) {
                        $start = \Carbon\Carbon::parse($exp->start_date);
                        $end = $exp->end_date ? \Carbon\Carbon::parse($exp->end_date) : now();
                        return $start->diffInYears($end);
                    }),
            ],
            'services' => [
                'total' => Service::where('user_id', $userId)->count(),
            ],
            'testimonials' => [
                'total' => Testimonial::where('user_id', $userId)->count(),
                'featured' => Testimonial::where('user_id', $userId)
                    ->where('featured', true)
                    ->count(),
            ],
        ];
    }

    /**
     * Get stats for freelancer users.
     */
    private function getFreelancerStats($user)
    {
        $userId = $user->id;

        $stats = $this->getDeveloperStats($user);
        
        // Add freelancer-specific stats
        $stats['client_work'] = [
            'total_projects' => Projects::where('user_id', $userId)
                ->where('type', 'professional_project')
                ->count(),
            'completed' => Projects::where('user_id', $userId)
                ->where('type', 'professional_project')
                ->where('status', 'published')
                ->count(),
            'testimonials' => Testimonial::where('user_id', $userId)->count(),
        ];

        $stats['inquiries'] = [
            'total' => Contact::count(),
            'unread' => Contact::where('status', 'unread')->count(),
            'replied' => Contact::where('status', 'replied')->count(),
        ];

        return $stats;
    }

    /**
     * Get generic stats for users without specific type.
     */
    private function getGenericStats($user)
    {
        $userId = $user->id;

        return [
            'achievements' => [
                'projects' => Projects::where('user_id', $userId)->count(),
                'featured_work' => Projects::where('user_id', $userId)
                    ->where('featured', true)
                    ->count(),
                'testimonials' => Testimonial::where('user_id', $userId)->count(),
            ],
            'activities' => [
                'total_projects' => Projects::where('user_id', $userId)->count(),
                'total_skills' => UserSkill::where('user_id', $userId)->count(),
                'total_experiences' => Experience::where('user_id', $userId)->count(),
            ],
            'connections' => [
                'messages_received' => Contact::count(),
                'unread_messages' => Contact::where('status', 'unread')->count(),
                'response_rate' => $this->calculateResponseRate(),
            ],
            'profile' => [
                'completion' => $this->calculateProfileCompletion($user),
                'views' => DB::table('user_profiles')
                    ->where('user_id', $userId)
                    ->value('profile_views') ?? 0,
            ],
        ];
    }

    /**
     * Calculate response rate for messages.
     */
    private function calculateResponseRate()
    {
        $total = Contact::count();
        if ($total === 0) {
            return 0;
        }

        $replied = Contact::where('status', 'replied')->count();
        return round(($replied / $total) * 100, 2);
    }

    /**
     * Calculate profile completion percentage.
     */
    private function calculateProfileCompletion($user)
    {
        $fields = [
            'name' => $user->name,
            'email' => $user->email,
            'profile' => DB::table('user_profiles')->where('user_id', $user->id)->exists(),
            'skills' => UserSkill::where('user_id', $user->id)->exists(),
            'experience' => Experience::where('user_id', $user->id)->exists(),
            'projects' => Projects::where('user_id', $user->id)->exists(),
        ];

        $completed = count(array_filter($fields));
        $total = count($fields);

        return round(($completed / $total) * 100, 2);
    }

    /**
     * Get recent projects.
     */
    public function recentProjects(Request $request)
    {
        $limit = $request->get('limit', 5);
        $userId = $request->user()->id;

        $projects = Projects::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get(['id', 'title', 'slug', 'status', 'featured', 'type', 'created_at']);

        return response()->json([
            'success' => true,
            'data' => $projects,
        ]);
    }

    /**
     * Get recent contact messages.
     */
    public function recentMessages(Request $request)
    {
        $limit = $request->get('limit', 10);

        $messages = Contact::orderBy('created_at', 'desc')
            ->limit($limit)
            ->get(['id', 'name', 'email', 'subject', 'status', 'created_at']);

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    /**
     * Get recent activity log.
     */
    public function activity(Request $request)
    {
        $limit = $request->get('limit', 20);
        $userId = $request->user()->id;

        $activities = collect();

        // Recent projects
        $recentProjects = Projects::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($project) {
                return [
                    'type' => 'project',
                    'action' => 'created',
                    'title' => $project->title,
                    'description' => "Created project: {$project->title}",
                    'status' => $project->status,
                    'project_type' => $project->type,
                    'created_at' => $project->created_at,
                ];
            });

        // Recent skills
        $recentSkills = UserSkill::where('user_id', $userId)
            ->join('skills', 'user_skills.skill_id', '=', 'skills.id')
            ->orderBy('user_skills.created_at', 'desc')
            ->limit($limit)
            ->get(['user_skills.*', 'skills.name'])
            ->map(function ($skill) {
                return [
                    'type' => 'skill',
                    'action' => 'added',
                    'title' => $skill->name,
                    'description' => "Added skill: {$skill->name}",
                    'proficiency' => $skill->proficiency,
                    'created_at' => $skill->created_at,
                ];
            });

        // Recent messages
        $recentMessages = Contact::orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($contact) {
                return [
                    'type' => 'message',
                    'action' => 'received',
                    'title' => $contact->subject,
                    'description' => "New message from {$contact->name}",
                    'status' => $contact->status,
                    'created_at' => $contact->created_at,
                ];
            });

        // Merge and sort all activities
        $activities = $activities
            ->merge($recentProjects)
            ->merge($recentSkills)
            ->merge($recentMessages)
            ->sortByDesc('created_at')
            ->take($limit)
            ->values();

        return response()->json([
            'success' => true,
            'data' => $activities,
        ]);
    }

    /**
     * Get chart data for analytics.
     */
    public function analytics(Request $request)
    {
        $userId = $request->user()->id;
        $period = $request->get('period', '30');

        $cacheKey = "dashboard:analytics:{$userId}:{$period}";

        $analytics = Cache::remember($cacheKey, 3600, function () use ($userId, $period) {
            $startDate = now()->subDays($period);

            // Projects created over time
            $projectsChart = Projects::where('user_id', $userId)
                ->where('created_at', '>=', $startDate)
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('count(*) as count')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Messages received over time
            $messagesChart = Contact::where('created_at', '>=', $startDate)
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('count(*) as count')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Skills by proficiency
            $skillsByProficiency = UserSkill::where('user_id', $userId)
                ->select('proficiency', DB::raw('count(*) as count'))
                ->groupBy('proficiency')
                ->get();

            // Projects by type
            $projectsByType = Projects::where('user_id', $userId)
                ->select('type', DB::raw('count(*) as count'))
                ->groupBy('type')
                ->get();

            return [
                'projects_over_time' => $projectsChart,
                'messages_over_time' => $messagesChart,
                'skills_by_proficiency' => $skillsByProficiency,
                'projects_by_type' => $projectsByType,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $analytics,
        ]);
    }

    /**
     * Get overall summary.
     */
    public function summary(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;

        $user->load('userType');
        $userTypeSlug = $user->userType?->slug ?? 'professional';

        $summary = [
            'user' => array_merge(
                $user->only(['name', 'email', 'email_verified_at']),
                ['user_type' => $user->userType?->name ?? 'Professional']
            ),
            'quick_stats' => [
                'total_projects' => Projects::where('user_id', $userId)->count(),
                'total_skills' => UserSkill::where('user_id', $userId)->count(),
                'unread_messages' => Contact::where('status', 'unread')->count(),
                'total_experiences' => Experience::where('user_id', $userId)->count(),
            ],
            'latest_activity' => [
                'last_project' => Projects::where('user_id', $userId)
                    ->latest()
                    ->first(['title', 'type', 'created_at']),
                'last_message' => Contact::latest()
                    ->first(['name', 'subject', 'created_at']),
            ],
            'profile_completion' => $this->calculateProfileCompletion($user),
        ];

        return response()->json([
            'success' => true,
            'data' => $summary,
        ]);
    }
}
