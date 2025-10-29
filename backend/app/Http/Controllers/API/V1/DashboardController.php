<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Experience;
use App\Models\Projects;
use App\Models\Service;
use App\Models\Skills;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics.
     */
    public function stats(Request $request)
    {
        $cacheKey = 'dashboard:stats:' . $request->user()->id;

        $stats = Cache::remember($cacheKey, 600, function () use ($request) {
            $userId = $request->user()->id;

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
                ],
                'skills' => [
                    'total' => Skills::where('user_id', $userId)->count(),
                    'by_category' => Skills::where('user_id', $userId)
                        ->select('category', DB::raw('count(*) as count'))
                        ->groupBy('category')
                        ->pluck('count', 'category'),
                ],
                'messages' => [
                    'total' => Contact::count(),
                    'unread' => Contact::where('status', 'unread')->count(),
                    'read' => Contact::where('status', 'read')->count(),
                    'replied' => Contact::where('status', 'replied')->count(),
                ],
                'experiences' => [
                    'total' => Experience::where('user_id', $userId)->count(),
                    'current' => Experience::where('user_id', $userId)
                        ->where('is_current', true)
                        ->count(),
                ],
                'testimonials' => [
                    'total' => Testimonial::where('user_id', $userId)->count(),
                    'featured' => Testimonial::where('user_id', $userId)
                        ->where('featured', true)
                        ->count(),
                ],
                'services' => [
                    'total' => Service::where('user_id', $userId)->count(),
                ],
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
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
            ->get(['id', 'title', 'slug', 'status', 'featured', 'created_at']);

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

        // Combine recent activities from different models
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
                    'created_at' => $project->created_at,
                ];
            });

        // Recent skills
        $recentSkills = Skills::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($skill) {
                return [
                    'type' => 'skill',
                    'action' => 'added',
                    'title' => $skill->name,
                    'description' => "Added skill: {$skill->name} ({$skill->category})",
                    'category' => $skill->category,
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
        $period = $request->get('period', '30'); // days

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

            // Skills by category
            $skillsByCategory = Skills::where('user_id', $userId)
                ->select('category', DB::raw('count(*) as count'))
                ->groupBy('category')
                ->get();

            // Technology usage in projects
            $technologies = Projects::where('user_id', $userId)
                ->whereNotNull('technologies')
                ->get()
                ->pluck('technologies')
                ->flatten()
                ->countBy()
                ->sortDesc()
                ->take(10);

            return [
                'projects_over_time' => $projectsChart,
                'messages_over_time' => $messagesChart,
                'skills_by_category' => $skillsByCategory,
                'top_technologies' => $technologies,
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
        $userId = $request->user()->id;

        $summary = [
            'user' => $request->user()->only(['name', 'email', 'email_verified_at']),
            'quick_stats' => [
                'total_projects' => Projects::where('user_id', $userId)->count(),
                'total_skills' => Skills::where('user_id', $userId)->count(),
                'unread_messages' => Contact::where('status', 'unread')->count(),
                'total_experiences' => Experience::where('user_id', $userId)->count(),
            ],
            'latest_activity' => [
                'last_project' => Projects::where('user_id', $userId)
                    ->latest()
                    ->first(['title', 'created_at']),
                'last_message' => Contact::latest()
                    ->first(['name', 'subject', 'created_at']),
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $summary,
        ]);
    }
}
