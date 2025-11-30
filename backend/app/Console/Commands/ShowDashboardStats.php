<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class ShowDashboardStats extends Command
{
    protected $signature = 'dashboard:stats 
                            {email : User email to show stats for}
                            {--json : Output as JSON}
                            {--clear-cache : Clear cache before fetching}';

    protected $description = 'Display dashboard statistics for a user';

    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("❌ User not found: {$email}");
            return 1;
        }

        if ($this->option('clear-cache')) {
            \Illuminate\Support\Facades\Cache::forget('dashboard:stats:' . $user->id);
            $this->info('🧹 Cache cleared');
            $this->newLine();
        }

        $this->info("📊 Dashboard Stats for: {$user->name}");
        $this->info("📧 Email: {$user->email}");
        $this->info("👤 Type: " . ($user->userType?->name ?? 'Professional'));
        $this->newLine();

        // Get stats using the controller method
        $controller = new \App\Http\Controllers\API\V1\DashboardController();
        $request = new \Illuminate\Http\Request();
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        $response = $controller->stats($request);
        $data = $response->getData(true);
        $stats = $data['data'] ?? [];

        if ($this->option('json')) {
            $this->line(json_encode($stats, JSON_PRETTY_PRINT));
            return 0;
        }

        // Display based on user type
        $userTypeSlug = $user->userType?->slug ?? 'professional';

        match($userTypeSlug) {
            'student' => $this->displayStudentStats($stats),
            'teacher' => $this->displayTeacherStats($stats),
            'professional' => $this->displayProfessionalStats($stats),
            'freelancer' => $this->displayFreelancerStats($stats),
            default => $this->displayGenericStats($stats),
        };

        return 0;
    }

    private function displayStudentStats($stats)
    {
        $this->info('🎓 STUDENT DASHBOARD');
        $this->newLine();

        if (isset($stats['courses'])) {
            $this->line('📚 Courses:');
            $this->line("  Total: {$stats['courses']['total']}");
            $this->line("  Current Semester: {$stats['courses']['current_semester']}");
            $this->line("  In Progress: {$stats['courses']['in_progress']}");
            $this->newLine();
        }

        if (isset($stats['assignments'])) {
            $this->line('📝 Assignments:');
            $this->line("  Total: {$stats['assignments']['total']}");
            $this->line("  Completed: {$stats['assignments']['completed']}");
            $this->line("  Pending: {$stats['assignments']['pending']}");
            $this->newLine();
        }

        if (isset($stats['academic_performance'])) {
            $this->line('🎯 Academic Performance:');
            $gpa = $stats['academic_performance']['gpa'] ?? 'N/A';
            $this->line("  GPA: {$gpa}");
            $this->line("  Research Papers: {$stats['academic_performance']['research_papers']}");
            $this->newLine();
        }

        if (isset($stats['projects'])) {
            $this->line('💼 Projects:');
            $this->line("  Total: {$stats['projects']['total']}");
            $this->line("  Featured: {$stats['projects']['featured']}");
            $this->newLine();
        }

        if (isset($stats['skills'])) {
            $this->line('🎯 Skills:');
            $this->line("  Total: {$stats['skills']['total']}");
            
            if (!empty($stats['skills']['by_proficiency'])) {
                $this->line('  By Proficiency:');
                foreach ($stats['skills']['by_proficiency'] as $level => $count) {
                    $this->line("    " . ucfirst($level) . ": {$count}");
                }
            }
        }
    }

    private function displayTeacherStats($stats)
    {
        $this->info('👨‍🏫 TEACHER DASHBOARD');
        $this->newLine();

        if (isset($stats['classes'])) {
            $this->line('📚 Classes:');
            $this->line("  Total: {$stats['classes']['total']}");
            $this->line("  Active: {$stats['classes']['active']}");
            $this->newLine();
        }

        if (isset($stats['students'])) {
            $this->line('👥 Students:');
            $this->line("  Total: {$stats['students']['total']}");
            $this->line("  Active Inquiries: {$stats['students']['active_inquiries']}");
            $this->newLine();
        }

        if (isset($stats['materials'])) {
            $this->line('📖 Teaching Materials:');
            $this->line("  Total: {$stats['materials']['total']}");
            $this->line("  Published: {$stats['materials']['published']}");
            $this->line("  Research Papers: {$stats['materials']['research_papers']}");
            $this->newLine();
        }

        if (isset($stats['ratings'])) {
            $this->line('⭐ Ratings:');
            $this->line("  Testimonials: {$stats['ratings']['testimonials']}");
            $this->line("  Featured: {$stats['ratings']['featured']}");
            $avgRating = number_format($stats['ratings']['average_rating'], 2);
            $this->line("  Average Rating: {$avgRating}");
            $this->newLine();
        }

        if (isset($stats['experience'])) {
            $this->line('💼 Experience:');
            $this->line("  Total Positions: {$stats['experience']['total_positions']}");
            $this->line("  Years Teaching: {$stats['experience']['years_teaching']}");
        }
    }

    private function displayProfessionalStats($stats)
    {
        $this->info('💻 PROFESSIONAL DASHBOARD');
        $this->newLine();

        if (isset($stats['projects'])) {
            $this->line('📁 Projects:');
            $this->line("  Total: {$stats['projects']['total']}");
            $this->line("  Published: {$stats['projects']['published']}");
            $this->line("  Draft: {$stats['projects']['draft']}");
            $this->line("  Featured: {$stats['projects']['featured']}");
            
            if (!empty($stats['projects']['by_type'])) {
                $this->line('  By Type:');
                foreach ($stats['projects']['by_type'] as $type => $count) {
                    $this->line("    " . ucwords(str_replace('_', ' ', $type)) . ": {$count}");
                }
            }
            $this->newLine();
        }

        if (isset($stats['tech_stack'])) {
            $this->line('🛠️  Tech Stack:');
            $this->line("  Total Skills: {$stats['tech_stack']['total_skills']}");
            
            if (!empty($stats['tech_stack']['by_proficiency'])) {
                $this->line('  By Proficiency:');
                foreach ($stats['tech_stack']['by_proficiency'] as $level => $count) {
                    $this->line("    " . ucfirst($level) . ": {$count}");
                }
            }
            
            if (!empty($stats['tech_stack']['top_skills'])) {
                $this->line('  Top Skills: ' . implode(', ', $stats['tech_stack']['top_skills']));
            }
            $this->newLine();
        }

        if (isset($stats['experience'])) {
            $this->line('💼 Experience:');
            $this->line("  Total Positions: {$stats['experience']['total']}");
            $this->line("  Current: {$stats['experience']['current']}");
            $this->line("  Years: {$stats['experience']['years']}");
            $this->newLine();
        }

        // ✅ FIXED: Uncommented services section
        if (isset($stats['services'])) {
            $this->line("🛠️  Services: {$stats['services']['total']}");
            $this->newLine();
        }

        // ✅ FIXED: Uncommented testimonials section
        if (isset($stats['testimonials'])) {
            $this->line('⭐ Testimonials:');
            $this->line("  Total: {$stats['testimonials']['total']}");
            $this->line("  Featured: {$stats['testimonials']['featured']}");
        }
    }

    // ✅ FIXED: Uncommented freelancer stats method
    private function displayFreelancerStats($stats)
    {
        $this->displayProfessionalStats($stats);
        
        $this->newLine();
        
        if (isset($stats['client_work'])) {
            $this->line('👔 Client Work:');
            $this->line("  Total Projects: {$stats['client_work']['total_projects']}");
            $this->line("  Completed: {$stats['client_work']['completed']}");
            $this->line("  Testimonials: {$stats['client_work']['testimonials']}");
            $this->newLine();
        }

        if (isset($stats['inquiries'])) {
            $this->line('💬 Inquiries:');
            $this->line("  Total: {$stats['inquiries']['total']}");
            $this->line("  Unread: {$stats['inquiries']['unread']}");
            $this->line("  Replied: {$stats['inquiries']['replied']}");
        }
    }

    // ✅ FIXED: Uncommented generic stats method
    private function displayGenericStats($stats)
    {
        $this->info('📊 GENERIC DASHBOARD');
        $this->newLine();

        foreach ($stats as $category => $data) {
            if (!is_array($data)) {
                continue;
            }

            $this->line(ucwords(str_replace('_', ' ', $category)) . ':');
            foreach ($data as $key => $value) {
                if (is_array($value)) {
                    $value = json_encode($value);
                }
                $this->line("  " . ucwords(str_replace('_', ' ', $key)) . ": {$value}");
            }
            $this->newLine();
        }
    }
}
