<?php

namespace Database\Seeders;

use App\Models\Education;
use App\Models\Experience;
use App\Models\Projects;
use App\Models\Skills;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\UserType;
use App\Models\UserTypeField;
use App\Models\Contact;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserDataSeeder extends Seeder
{
    public function run(): void
    {
        // Get or create user type
        $userType = UserType::where('slug', 'student')->first();

        // Create user
        $user = User::firstOrCreate(
            ['email' => 'student@example.com'],
            [
                'name' => 'John Student',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'user_type_id' => $userType?->id, 
            ]
        );

        $userId = $user->id;

        // Seed user type specific fields
        if ($userType) {
            $this->seedUserTypeFields($userId, $userType);
        }

        // Seed all related data
        $this->seedEducation($userId);
        $this->seedProjects($userId);
        $this->seedSkills($userId);
        $this->seedExperience($userId);
        $this->seedServices($userId);
        $this->seedTestimonials($userId);
        $this->seedContacts($userId);

        $this->command->info("✅ User data seeded successfully for: {$user->email}");
    }

    private function seedUserTypeFields($userId, $userType)
    {
        $fields = [
            'gpa' => '3.8',
            'current_semester' => '6',
            'grade_level' => 'undergraduate',
            'institution' => 'Tech University',
            'major' => 'Computer Science',
            'graduation_year' => '2026'
        ];

        foreach ($fields as $slug => $value) {
            $fieldDef = UserTypeField::where('field_slug', $slug)
                ->where('user_type_id', $userType->id)
                ->first();
            
            if ($fieldDef) {
                DB::table('user_field_values')->updateOrInsert(
                    ['user_id' => $userId, 'user_type_field_id' => $fieldDef->id],
                    ['value' => $value, 'created_at' => now(), 'updated_at' => now()]
                );
            }
        }
    }

    private function seedEducation($userId)
    {
        $educations = [
            [
                'institution' => 'Tech University',
                'title' => 'Bachelor of Science in Computer Science',
                'field_or_department' => 'Computer Science',
                'role' => 'student',
                'is_current' => true,
                'start_date' => now()->subYears(2),
                'description' => 'Studying software engineering and algorithms'
            ],
            [
                'institution' => 'City High School',
                'title' => 'High School Diploma',
                'field_or_department' => 'General Studies',
                'role' => 'student',
                'is_current' => false,
                'start_date' => now()->subYears(6),
                'end_date' => now()->subYears(2),
                'description' => 'Graduated with honors'
            ]
        ];

        foreach ($educations as $education) {
            Education::create(array_merge(['user_id' => $userId], $education));
        }
    }

    private function seedProjects($userId)
    {
        $projects = [
            // Assignments
            [
                'title' => 'Data Structures Final Project',
                'slug' => 'ds-final-project',
                'description' => 'Implementation of Binary Trees and Graph Algorithms',
                'status' => 'published',
                'type' => 'assignment',
                'featured' => false,
                'technologies' => ['Java', 'JUnit'],
            ],
            [
                'title' => 'Database Design Assignment',
                'slug' => 'database-design',
                'description' => 'E-commerce database schema design',
                'status' => 'draft',
                'type' => 'assignment',
                'featured' => false,
                'technologies' => ['MySQL', 'SQL'],
            ],
            // Academic Projects
            [
                'title' => 'Machine Learning Research',
                'slug' => 'ml-research',
                'description' => 'Neural network optimization techniques',
                'status' => 'published',
                'type' => 'academic_project',
                'featured' => true,
                'technologies' => ['Python', 'TensorFlow'],
            ],
            // Research Papers
            [
                'title' => 'AI Ethics in Healthcare',
                'slug' => 'ai-ethics-paper',
                'description' => 'Research paper on ethical implications',
                'status' => 'published',
                'type' => 'research_paper',
                'featured' => true,
                'technologies' => ['Research', 'Writing'],
            ],
            // Personal Projects
            [
                'title' => 'Personal Portfolio Website',
                'slug' => 'portfolio-site',
                'description' => 'Modern portfolio built with React',
                'status' => 'published',
                'type' => 'personal_project',
                'featured' => true,
                'technologies' => ['React', 'Tailwind CSS', 'Node.js'],
            ],
            [
                'title' => 'Task Management App',
                'slug' => 'task-app',
                'description' => 'Full-stack task manager',
                'status' => 'draft',
                'type' => 'personal_project',
                'featured' => false,
                'technologies' => ['Laravel', 'Vue.js'],
            ],
        ];

        foreach ($projects as $project) {
            Projects::create(array_merge(['user_id' => $userId], $project));
        }
    }

    private function seedSkills($userId)
    {
        $skills = [
            ['name' => 'PHP', 'slug' => 'php', 'category' => 'backend', 'proficiency' => 'expert', 'years' => 3],
            ['name' => 'Laravel', 'slug' => 'laravel', 'category' => 'backend', 'proficiency' => 'advanced', 'years' => 2],
            ['name' => 'JavaScript', 'slug' => 'javascript', 'category' => 'frontend', 'proficiency' => 'expert', 'years' => 4],
            ['name' => 'React', 'slug' => 'react', 'category' => 'frontend', 'proficiency' => 'intermediate', 'years' => 2],
            ['name' => 'MySQL', 'slug' => 'mysql', 'category' => 'database', 'proficiency' => 'advanced', 'years' => 3],
            ['name' => 'Python', 'slug' => 'python', 'category' => 'backend', 'proficiency' => 'beginner', 'years' => 1],
        ];

        foreach ($skills as $skillData) {
            $years = $skillData['years'];
            $proficiency = $skillData['proficiency'];
            unset($skillData['years'], $skillData['proficiency']);
            
            $skill = Skills::firstOrCreate(
                ['slug' => $skillData['slug']],
                $skillData
            );

            UserSkill::create([
                'user_id' => $userId,
                'skill_id' => $skill->id,
                'proficiency' => $proficiency,
                'years_experience' => $years,
            ]);
        }
    }

    private function seedExperience($userId)
    {
        $experiences = [
            [
                'company' => 'Tech Startup Inc.',
                'position' => 'Junior Developer Intern',
                'description' => 'Developed web applications using Laravel and React',
                'is_current' => true,
                'start_date' => now()->subYear(),
                'end_date' => null,
            ],
            [
                'company' => 'Freelance',
                'position' => 'Web Developer',
                'description' => 'Built websites for local businesses',
                'is_current' => false,
                'start_date' => now()->subYears(2),
                'end_date' => now()->subYear(),
            ],
        ];

        foreach ($experiences as $experience) {
            Experience::create(array_merge(['user_id' => $userId], $experience));
        }
    }

    private function seedServices($userId)
    {
        $services = [
            [
                'title' => 'Web Development',
                'slug' => 'web-development',
                'description' => 'Full-stack web application development',
                'features' => ['Custom Design', 'Responsive Layout', 'API Integration'],
            ],
            [
                'title' => 'Backend Development',
                'slug' => 'backend-development',
                'description' => 'Server-side logic and database management',
                'features' => ['REST API', 'Database Design', 'Authentication'],
            ],
        ];

        foreach ($services as $service) {
            Service::create(array_merge(['user_id' => $userId], $service));
        }
    }

    private function seedTestimonials($userId)
    {
        $testimonials = [
            [
                'name' => 'Sarah Johnson',
                'role' => 'Project Manager',
                'company' => 'Tech Startup Inc.',
                'content' => 'Excellent work! Very professional and delivered on time.',
                'rating' => 5,
                'slug' => 'sarah-johnson',
                'featured' => true,
            ],
            [
                'name' => 'Michael Chen',
                'role' => 'CEO',
                'company' => 'Local Business',
                'content' => 'Great communication and technical skills.',
                'rating' => 5,
                'slug' => 'michael-chen',
                'featured' => false,
            ],
            [
                'name' => 'Emily Davis',
                'role' => 'Marketing Director',
                'company' => 'Creative Agency',
                'content' => 'Highly recommend! Will work with again.',
                'rating' => 4,
                'slug' => 'emily-davis',
                'featured' => true,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create(array_merge(['user_id' => $userId], $testimonial));
        }
    }

    private function seedContacts($userId)
    {
        $contacts = [
            [
                'user_id' => $userId,
                'name' => 'Alice Brown',
                'email' => 'alice@example.com',
                'subject' => 'Project Inquiry',
                'message' => 'I would like to discuss a potential project.',
                'status' => 'unread',
            ],
            [
                'user_id' => $userId,
                'name' => 'Bob Wilson',
                'email' => 'bob@example.com',
                'subject' => 'Question about Services',
                'message' => 'What are your rates for web development?',
                'status' => 'replied',
            ],
            [
                'user_id' => $userId,
                'name' => 'Carol Martinez',
                'email' => 'carol@example.com',
                'subject' => 'Collaboration Opportunity',
                'message' => 'Interested in collaborating on a project.',
                'status' => 'unread',
            ],
        ];

        foreach ($contacts as $contact) {
            Contact::create($contact);
        }
    }
}
