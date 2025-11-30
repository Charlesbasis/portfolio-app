<?php

namespace App\Console\Commands;

use App\Models\Contact;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Projects;
use App\Models\Service;
use App\Models\Skills;
use App\Models\Testimonial;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\UserType;
use App\Models\UserTypeField;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SeedDashboardData extends Command
{
    protected $signature = 'dashboard:seed 
                            {email? : User email to seed data for}
                            {--type=professional : User type (student, teacher, professional, freelancer)}
                            {--projects=10 : Number of projects to create}
                            {--skills=8 : Number of skills to create}
                            {--contacts=15 : Number of contacts to create}
                            {--experiences=3 : Number of experiences to create}
                            {--testimonials=5 : Number of testimonials to create}
                            {--clear-cache : Clear dashboard cache after seeding}
                            {--fresh : Delete existing data before seeding}';

    protected $description = 'Seed dashboard data dynamically for testing';

    public function handle()
    {
        $this->info('🚀 Starting Dashboard Data Seeding...');
        $this->newLine();

        // Get or create user
        $user = $this->getOrCreateUser();
        
        if (!$user) {
            $this->error('❌ Failed to get or create user');
            return 1;
        }

        $this->info("👤 User: {$user->name} ({$user->email})");
        $this->info("📋 Type: {$user->userType?->name}");
        $this->info("🆔 User ID: {$user->id}");
        $this->newLine();

        // Clear existing data if requested
        if ($this->option('fresh')) {
            $this->clearUserData($user);
        }

        // Test database connection and model
        $this->testDatabaseConnection($user);

        // Seed all data types
        $this->seedAllData($user);

        // Clear cache AFTER seeding
        if ($this->option('clear-cache')) {
            $this->clearCache($user);
        }

        $this->newLine();
        $this->info('✅ Dashboard data seeding completed!');
        $this->newLine();
        
        // Show summary
        $this->showSummary($user);
        
        $this->newLine();
        $this->comment('💡 API Endpoint: GET /api/v1/dashboard/stats');
        $this->comment('💡 Test with: php artisan dashboard:stats ' . $user->email);

        return 0;
    }

    private function testDatabaseConnection($user)
    {
        $this->line('🔍 Testing database connection and model configuration...');
        
        try {
            // Test Projects model
            $testProject = new Projects();
            $fillable = $testProject->getFillable();
            $guarded = $testProject->getGuarded();
            
            if (empty($fillable) && empty($guarded)) {
                $this->error('❌ Projects model has NO fillable or guarded properties!');
                $this->error('   Add this to your Projects model:');
                $this->error('   protected $guarded = [];');
                return;
            }
            
            $this->info('✓ Projects model configuration OK');
            $this->line('  Fillable: ' . json_encode($fillable));
            $this->line('  Guarded: ' . json_encode($guarded));
            
            // Try to create a test project
            $testData = [
                'user_id' => $user->id,
                'title' => 'Test Project',
                'slug' => 'test-project-' . uniqid(),
                'description' => 'Test description',
                'status' => 'draft',
                'type' => 'personal_project',
                'featured' => false,
                'technologies' => ['PHP', 'Laravel'],
            ];
            
            $this->line('  Testing project creation with data:');
            $this->line('  ' . json_encode($testData, JSON_PRETTY_PRINT));
            
            $project = Projects::create($testData);
            
            if ($project->id) {
                $this->info('✓ Successfully created test project with ID: ' . $project->id);
                // Delete test project
                $project->delete();
                $this->info('✓ Test project deleted');
            }
            
        } catch (\Exception $e) {
            $this->error('❌ Database test failed!');
            $this->error('   Error: ' . $e->getMessage());
            $this->error('   File: ' . $e->getFile() . ':' . $e->getLine());
            $this->newLine();
            $this->error('🛑 Fix the error above before continuing!');
            exit(1);
        }
        
        $this->newLine();
    }

    private function getOrCreateUser()
    {
        $email = $this->argument('email');
        
        if (!$email) {
            $email = $this->ask('Enter user email', 'test@example.com');
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            if (!$this->confirm("User not found. Create new user?", true)) {
                return null;
            }

            $name = $this->ask('Enter user name', 'Test User');
            $userTypeSlug = $this->option('type');
            $userType = UserType::where('slug', $userTypeSlug)->first();

            if (!$userType) {
                $this->error("❌ User type '{$userTypeSlug}' not found!");
                $this->info("Available types: student, teacher, professional, freelancer");
                return null;
            }

            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'user_type_id' => $userType->id,
                'onboarding_completed' => true,
                'onboarding_completed_at' => now(),
            ]);

            $this->info("✅ User created successfully with ID: {$user->id}");
            
            // Seed user type fields
            if ($userType) {
                $this->seedUserTypeFields($user, $userType);
            }
        } else {
            if (!$user->onboarding_completed) {
                $this->warn("⚠️  User hasn't completed onboarding. Marking as completed...");
                $user->update([
                    'onboarding_completed' => true,
                    'onboarding_completed_at' => now(),
                ]);
            }
        }

        return $user->fresh();
    }

    private function seedUserTypeFields($user, $userType)
    {
        $fields = match($userType->slug) {
            'student' => [
                'gpa' => '3.8',
                'current_semester' => '6',
                'grade_level' => 'undergraduate',
                'institution' => 'Tech University',
                'major' => 'Computer Science',
                'graduation_year' => '2026'
            ],
            'teacher' => [
                'subject_specialty' => 'Computer Science',
                'teaching_level' => 'college',
                'years_experience' => '5',
            ],
            'professional' => [
                'current_role' => 'Senior Full Stack Developer',
                'years_experience' => '8',
                'specialization' => 'fullstack',
            ],
            'freelancer' => [
                'hourly_rate' => '75',
                'portfolio_url' => 'https://example.com',
                'specialization' => 'web-dev',
            ],
            default => []
        };

        foreach ($fields as $slug => $value) {
            $fieldDef = UserTypeField::where('field_slug', $slug)
                ->where('user_type_id', $userType->id)
                ->first();
            
            if ($fieldDef) {
                DB::table('user_field_values')->updateOrInsert(
                    ['user_id' => $user->id, 'user_type_field_id' => $fieldDef->id],
                    ['value' => $value, 'created_at' => now(), 'updated_at' => now()]
                );
            }
        }
    }

    private function clearUserData($user)
    {
        if (!$this->confirm('⚠️  This will delete all existing data for this user. Continue?', false)) {
            $this->info('Skipping data deletion...');
            return;
        }

        $this->warn('🗑️  Clearing existing data...');
        
        Projects::where('user_id', $user->id)->delete();
        UserSkill::where('user_id', $user->id)->delete();
        Contact::where('user_id', $user->id)->delete();
        Experience::where('user_id', $user->id)->delete();
        Education::where('user_id', $user->id)->delete();
        Service::where('user_id', $user->id)->delete();
        Testimonial::where('user_id', $user->id)->delete();
        
        $this->info('✅ Data cleared');
        $this->newLine();
    }

    private function clearCache($user)
    {
        Cache::forget('dashboard:stats:' . $user->id);
        Cache::forget('dashboard:analytics:' . $user->id . ':30');
        $this->info('🧹 Cache cleared');
        $this->newLine();
    }

    private function seedAllData($user)
    {
        $projectCount = (int) $this->option('projects');
        $skillCount = (int) $this->option('skills');
        $contactCount = (int) $this->option('contacts');
        $experienceCount = (int) $this->option('experiences');
        $testimonialCount = (int) $this->option('testimonials');

        $this->seedProjects($user, $projectCount);
        $this->seedSkills($user, $skillCount);
        $this->seedContacts($user, $contactCount);
        $this->seedExperiences($user, $experienceCount);
        $this->seedEducation($user);
        $this->seedServices($user);
        $this->seedTestimonials($user, $testimonialCount);
    }

    private function seedProjects($user, $count)
    {
        $this->line('📁 Creating projects...');
        
        $userTypeSlug = $user->userType?->slug ?? 'professional';
        
        $types = match($userTypeSlug) {
            'student' => ['assignment', 'academic_project', 'personal_project', 'research_paper'],
            'teacher' => ['academic_project', 'research_paper'],
            'professional' => ['professional_project', 'personal_project'],
            'freelancer' => ['professional_project', 'personal_project'],
            default => ['personal_project']
        };

        $statuses = ['published', 'draft'];
        $technologies = [
            ['PHP', 'Laravel', 'MySQL'],
            ['JavaScript', 'React', 'Node.js'],
            ['Python', 'Django', 'PostgreSQL'],
            ['Vue.js', 'Tailwind CSS', 'Firebase'],
            ['TypeScript', 'Next.js', 'MongoDB'],
        ];

        $bar = $this->output->createProgressBar($count);
        $bar->setFormat('verbose');
        $bar->start();

        $createdCount = 0;

        for ($i = 1; $i <= $count; $i++) {
            try {
                $type = $types[array_rand($types)];
                
                $project = Projects::create([
                    'user_id' => $user->id,
                    'title' => $this->generateProjectTitle($type, $i),
                    'slug' => 'project-' . $i . '-' . uniqid(),
                    'description' => $this->generateProjectDescription($type),
                    'status' => $statuses[array_rand($statuses)],
                    'type' => $type,
                    'featured' => rand(0, 3) === 0,
                    'technologies' => $technologies[array_rand($technologies)],
                ]);
                
                $createdCount++;
                $bar->advance();
                usleep(10000);
            } catch (\Exception $e) {
                $bar->clear();
                $this->newLine();
                $this->error("Failed to create project #{$i}: {$e->getMessage()}");
                $this->error("File: {$e->getFile()}:{$e->getLine()}");
                $bar->display();
            }
        }

        $bar->finish();
        $this->newLine();
        $this->info("  ✓ Created {$createdCount} projects");
        $this->newLine();
    }

    private function generateProjectTitle($type, $number)
    {
        $titles = [
            'assignment' => [
                'Data Structures Assignment',
                'Algorithm Analysis Project',
                'Database Design Task',
                'Web Development Assignment',
                'Mobile App Development',
            ],
            'academic_project' => [
                'Machine Learning Research',
                'Computer Vision Application',
                'Distributed Systems Study',
                'Cloud Computing Project',
                'AI Ethics Investigation',
            ],
            'research_paper' => [
                'Neural Network Optimization',
                'Blockchain Technology Analysis',
                'Quantum Computing Research',
                'Cybersecurity Frameworks',
                'IoT Security Protocols',
            ],
            'professional_project' => [
                'E-commerce Platform',
                'CRM System Development',
                'Mobile Banking App',
                'Content Management System',
                'Analytics Dashboard',
            ],
            'personal_project' => [
                'Portfolio Website',
                'Task Management App',
                'Weather Forecast App',
                'Blog Platform',
                'Social Media Dashboard',
            ],
        ];

        $typesTitles = $titles[$type] ?? $titles['personal_project'];
        return $typesTitles[($number - 1) % count($typesTitles)] . " #{$number}";
    }

    private function generateProjectDescription($type)
    {
        $descriptions = [
            'assignment' => 'Academic assignment focusing on core computer science concepts and practical implementation.',
            'academic_project' => 'Research-based academic project exploring advanced topics in computer science.',
            'research_paper' => 'Comprehensive research paper investigating cutting-edge technology and methodologies.',
            'professional_project' => 'Production-ready application built for real-world business requirements.',
            'personal_project' => 'Personal project showcasing technical skills and creative problem-solving.',
        ];

        return $descriptions[$type] ?? 'A comprehensive project demonstrating technical expertise.';
    }

    private function seedSkills($user, $count)
    {
        $this->line('🎯 Creating skills...');
        
        $skillsData = [
            ['name' => 'PHP', 'category' => 'backend'],
            ['name' => 'Laravel', 'category' => 'backend'],
            ['name' => 'JavaScript', 'category' => 'frontend'],
            ['name' => 'React', 'category' => 'frontend'],
            ['name' => 'Vue.js', 'category' => 'frontend'],
            ['name' => 'Node.js', 'category' => 'backend'],
            ['name' => 'Python', 'category' => 'backend'],
            ['name' => 'Django', 'category' => 'backend'],
            ['name' => 'MySQL', 'category' => 'database'],
            ['name' => 'PostgreSQL', 'category' => 'database'],
            ['name' => 'MongoDB', 'category' => 'database'],
            ['name' => 'Docker', 'category' => 'devops'],
            ['name' => 'AWS', 'category' => 'devops'],
            ['name' => 'Git', 'category' => 'tools'],
            ['name' => 'TypeScript', 'category' => 'frontend'],
        ];

        $proficiencies = ['beginner', 'intermediate', 'advanced', 'expert'];
        $proficiencyMap = [
            'beginner' => 25,
            'intermediate' => 50,
            'advanced' => 75,
            'expert' => 90
        ];

        $bar = $this->output->createProgressBar(min($count, count($skillsData)));
        $bar->start();

        $createdCount = 0;

        for ($i = 0; $i < $count && $i < count($skillsData); $i++) {
            $skillData = $skillsData[$i];
            $proficiency = $proficiencies[array_rand($proficiencies)];
            $yearsExperience = rand(1, 10);

            try {
                $skill = Skills::firstOrCreate(
                    ['slug' => Str::slug($skillData['name'])],
                    [
                        'name' => $skillData['name'],
                        'category' => $skillData['category'],
                        'proficiency' => $proficiencyMap[$proficiency],
                        'years_of_experience' => $yearsExperience,
                    ]
                );

                UserSkill::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'skill_id' => $skill->id
                    ],
                    [
                        'proficiency' => $proficiency,
                        'years_experience' => $yearsExperience,
                    ]
                );

                $createdCount++;
                $bar->advance();
                usleep(10000);
            } catch (\Exception $e) {
                $bar->clear();
                $this->newLine();
                $this->error("Failed to create skill {$skillData['name']}: {$e->getMessage()}");
                $bar->display();
            }
        }

        $bar->finish();
        $this->newLine();
        $this->info("  ✓ Created {$createdCount} skills");
        $this->newLine();
    }

    private function seedContacts($user, $count)
    {
        $this->line('💬 Creating contact messages...');
        
        $statuses = ['unread', 'read', 'replied', 'archived'];
        $subjects = [
            'Project Inquiry',
            'Question about Services',
            'Collaboration Opportunity',
            'Hiring Opportunity',
            'Feedback on Portfolio',
            'Technical Question',
            'Partnership Proposal',
            'Consulting Request',
        ];

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        $createdCount = 0;

        for ($i = 1; $i <= $count; $i++) {
            try {
                Contact::create([
                    'user_id' => $user->id,
                    'name' => "Contact Person #{$i}",
                    'email' => "contact{$i}@example.com",
                    'subject' => $subjects[array_rand($subjects)],
                    'message' => "This is a sample inquiry message from contact #{$i}. I would like to discuss potential opportunities.",
                    'status' => $statuses[array_rand($statuses)],
                    'slug' => 'contact-' . $i . '-' . uniqid(),
                ]);
                
                $createdCount++;
                $bar->advance();
                usleep(10000);
            } catch (\Exception $e) {
                $bar->clear();
                $this->newLine();
                $this->error("Failed to create contact #{$i}: {$e->getMessage()}");
                $bar->display();
            }
        }

        $bar->finish();
        $this->newLine();
        $this->info("  ✓ Created {$createdCount} contact messages");
        $this->newLine();
    }

    private function seedExperiences($user, $count)
    {
        $this->line('💼 Creating work experiences...');
        
        $companies = [
            'Tech Startup Inc.',
            'Global Software Solutions',
            'Digital Innovation Labs',
            'Cloud Systems Corp',
            'Data Analytics Group',
        ];

        $positions = [
            'Software Developer',
            'Full Stack Developer',
            'Backend Engineer',
            'Frontend Developer',
            'DevOps Engineer',
        ];

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        $createdCount = 0;

        for ($i = 0; $i < $count; $i++) {
            try {
                $isCurrent = ($i === 0);
                $startDate = now()->subYears($count - $i + 1);
                $endDate = $isCurrent ? null : now()->subYears($count - $i);

                Experience::create([
                    'user_id' => $user->id,
                    'company' => $companies[$i % count($companies)],
                    'position' => $positions[$i % count($positions)],
                    'description' => 'Developed and maintained web applications using modern technologies and best practices.',
                    'is_current' => $isCurrent,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'slug' => 'experience-' . $i . '-' . uniqid(),
                ]);
                
                $createdCount++;
                $bar->advance();
                usleep(10000);
            } catch (\Exception $e) {
                $bar->clear();
                $this->newLine();
                $this->error("Failed to create experience #{$i}: {$e->getMessage()}");
                $bar->display();
            }
        }

        $bar->finish();
        $this->newLine();
        $this->info("  ✓ Created {$createdCount} work experiences");
        $this->newLine();
    }

    private function seedEducation($user)
    {
        $this->line('🎓 Creating education record...');
        
        try {
            $userTypeSlug = $user->userType?->slug ?? 'professional';
            
            $role = match($userTypeSlug) {
                'student' => 'student',
                'teacher' => 'teacher',
                default => 'student'
            };

            Education::firstOrCreate(
                ['user_id' => $user->id, 'institution' => 'Tech University'],
                [
                    'title' => 'Bachelor of Science in Computer Science',
                    'field_or_department' => 'Computer Science',
                    'role' => $role,
                    'is_current' => true,
                    'start_date' => now()->subYears(3),
                    'description' => 'Comprehensive computer science program with focus on software engineering.',
                ]
            );

            $this->info('  ✓ Created education record');
        } catch (\Exception $e) {
            $this->error("Failed to create education: {$e->getMessage()}");
        }
        
        $this->newLine();
    }

    private function seedServices($user)
    {
        $this->line('🛠️  Creating services...');
        
        $services = [
            [
                'title' => 'Web Development',
                'slug' => 'web-development-' . $user->id,
                'description' => 'Full-stack web application development with modern technologies',
                'features' => ['Custom Design', 'Responsive Layout', 'API Integration', 'SEO Optimization'],
                'user_id' => $user->id,
                'category' => 'development',
            ],
            [
                'title' => 'Backend Development',
                'slug' => 'backend-development-' . $user->id,
                'description' => 'Robust server-side solutions and database architecture',
                'features' => ['REST API', 'Database Design', 'Authentication', 'Performance Optimization'],
                'user_id' => $user->id,
                'category' => 'development',
            ],
            [
                'title' => 'Consulting',
                'slug' => 'consulting-' . $user->id,
                'description' => 'Technical consulting and architecture guidance',
                'features' => ['Technical Review', 'Architecture Design', 'Best Practices', 'Code Review'],
                'user_id' => $user->id,
                'category' => 'consulting',
            ],
        ];

        $bar = $this->output->createProgressBar(count($services));
        $bar->start();

        $createdCount = 0;

        foreach ($services as $serviceData) {
            try {
                Service::updateOrCreate(
                    ['user_id' => $user->id, 'slug' => $serviceData['slug']],
                    $serviceData
                );
                $createdCount++;
                $bar->advance();
                usleep(10000);
            } catch (\Exception $e) {
                $bar->clear();
                $this->newLine();
                $this->error("Failed to create service {$serviceData['title']}: {$e->getMessage()}");
                $bar->display();
            }
        }

        $bar->finish();
        $this->newLine();
        $this->info("  ✓ Created {$createdCount} services");
        $this->newLine();
    }

    private function seedTestimonials($user, $count)
    {
        $this->line('⭐ Creating testimonials...');
        
        $names = ['Sarah Johnson', 'Michael Chen', 'Emily Davis', 'David Wilson', 'Lisa Anderson'];
        $roles = ['CEO', 'Project Manager', 'CTO', 'Product Owner', 'Tech Lead'];
        $companies = ['Tech Corp', 'StartupXYZ', 'Digital Agency', 'Innovation Labs', 'Cloud Systems'];

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        $createdCount = 0;

        for ($i = 0; $i < $count; $i++) {
            try {
                $name = $names[$i % count($names)];
                $role = $roles[$i % count($roles)];
                $company = $companies[$i % count($companies)];

                $baseSlug = Str::slug($name);
                $slug = $baseSlug;
                $counter = 0;

                while (Testimonial::where('slug', $slug)->exists()) {
                    $counter++;
                    $slug = $baseSlug . '-' . $counter;
                }

                Testimonial::create([
                    'user_id' => $user->id,
                    'name' => $name,
                    'role' => $role,
                    'company' => $company,
                    'content' => $this->generateTestimonialContent($name, $role, $company),
                    'rating' => rand(4, 5),
                    'slug' => $slug,
                    'featured' => rand(0, 2) === 0,
                ]);

                $createdCount++;
                $bar->advance();
                usleep(10000);
            } catch (\Exception $e) {
                $bar->clear();
                $this->newLine();
                $this->error("Failed to create testimonial #{$i}: {$e->getMessage()}");
                $bar->display();
            }
        }

        $bar->finish();
        $this->newLine();
        $this->info("  ✓ Created {$createdCount} testimonials");
        $this->newLine();
    }

    private function generateTestimonialContent($name, $role, $company)
    {
        $contents = [
            "Working with this professional was an absolute pleasure! They delivered exceptional results that exceeded our expectations.",
            "Demonstrated remarkable expertise and professionalism throughout our project. Highly recommended!",
            "Outstanding work. Their attention to detail and technical skills are impressive.",
            "We hired them for a complex project and they delivered beyond our expectations. Truly exceptional!",
            "Their work speaks volumes about their capabilities. Professional, timely, and high-quality delivery."
        ];
        
        return $contents[array_rand($contents)];
    }

    private function showSummary($user)
    {
        $this->info('📊 Data Summary:');
        $this->newLine();
        
        $projectCount = Projects::where('user_id', $user->id)->count();
        $skillCount = UserSkill::where('user_id', $user->id)->count();
        $contactCount = Contact::where('user_id', $user->id)->count();
        $experienceCount = Experience::where('user_id', $user->id)->count();
        $educationCount = Education::where('user_id', $user->id)->count();
        $serviceCount = Service::where('user_id', $user->id)->count();
        $testimonialCount = Testimonial::where('user_id', $user->id)->count();

        $summary = [
            ['Type', 'Count'],
            ['Projects', $projectCount],
            ['Skills', $skillCount],
            ['Contacts', $contactCount],
            ['Experiences', $experienceCount],
            ['Education', $educationCount],
            ['Services', $serviceCount],
            ['Testimonials', $testimonialCount],
        ];

        $this->table($summary[0], array_slice($summary, 1));
        
        $totalCount = $projectCount + $skillCount + $contactCount + $experienceCount + $educationCount + $serviceCount + $testimonialCount;
        
        if ($totalCount === 0) {
            $this->newLine();
            $this->error('⚠️  WARNING: No data was created! Check for errors above.');
        }
    }
}
