<?php

namespace Database\Seeders;

use App\Models\Certification;
use App\Models\Education;
use App\Models\Experience;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\UserType;
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder
{
    public function run(): void
    {
        // Get user types for reference
        $professionalType = UserType::where('slug', 'professional')->first();
        $studentType = UserType::where('slug', 'student')->first();
        $teacherType = UserType::where('slug', 'teacher')->first();
        $freelancerType = UserType::where('slug', 'freelancer')->first();

        // Check if user types exist
        if (!$professionalType) {
            $this->command->error('User types not found. Please run UserTypeSeeder first.');
            return;
        }

        $user = User::first();
        
        if (!$user) {
            $user = User::create([
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'user_type_id' => UserType::where('slug', 'professional')->first()->id ?? null,
            ]);
        }

        // Get user types for reference
        $professionalType = UserType::where('slug', 'professional')->first();
        $studentType = UserType::where('slug', 'student')->first();
        $teacherType = UserType::where('slug', 'teacher')->first();

        // Create Main Profile with Flexible Fields
        UserProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'username' => 'johndoe',
                'full_name' => 'John Doe',
                'tagline' => 'Full Stack Developer | Laravel & React Specialist',
                'bio' => 'Passionate developer with 5+ years of experience building modern web applications. Specializing in Laravel, React, and cloud technologies.',
                'location' => 'San Francisco, CA',
                'website' => 'https://johndoe.com',
                'email' => $user->email,
                
                // Existing fields (now nullable)
                'job_title' => 'Senior Full Stack Developer',
                'company' => 'Tech Corp',
                'years_experience' => 5,
                
                // New flexible fields
                'user_type_id' => $professionalType->id ?? null,
                'headline' => 'Senior Full Stack Developer & Tech Lead',
                'current_status' => 'working',
                'institution' => 'Tech Corp Inc',
                'field_of_interest' => 'Web Development, Cloud Computing, AI/ML',
                'custom_fields' => [
                    'current_role' => 'Senior Full Stack Developer',
                    'skills' => ['Laravel', 'React', 'Vue.js', 'Node.js', 'AWS', 'Docker'],
                    'certifications' => ['AWS Solutions Architect', 'Laravel Certified', 'React Professional'],
                    'projects_completed' => 47,
                    'specialties' => ['API Development', 'System Architecture', 'Team Leadership'],
                    'hourly_rate' => 85,
                    'portfolio_url' => 'https://portfolio.johndoe.com',
                ],
                
                'availability_status' => 'available',
                'is_public' => true,
                'show_email' => true,
                'show_phone' => false,
                'github_url' => 'https://github.com/johndoe',
                'linkedin_url' => 'https://linkedin.com/in/johndoe',
                'twitter_url' => 'https://twitter.com/johndoe',
            ]
        );

        // Create additional sample profiles with different user types
        $this->createStudentProfile();
        $this->createTeacherProfile();
        $this->createFreelancerProfile();

        // Create Experience
        Experience::create([
            'user_id' => $user->id,
            'company' => 'Tech Corp',
            'position' => 'Senior Full Stack Developer',
            'description' => 'Leading development of enterprise web applications using Laravel and React. Managing a team of 5 developers.',
            'start_date' => '2021-01-01',
            'end_date' => null,
            'is_current' => true,
            'location' => 'San Francisco, CA',
            'company_url' => 'https://techcorp.com',
            'technologies' => ['Laravel', 'React', 'MySQL', 'AWS', 'Docker', 'Redis'],
            'order' => 0,
            'slug' => 'senior-full-stack-developer',
        ]);

        Experience::create([
            'user_id' => $user->id,
            'company' => 'StartupXYZ',
            'position' => 'Full Stack Developer',
            'description' => 'Built scalable web applications from scratch. Implemented CI/CD pipelines and cloud infrastructure.',
            'start_date' => '2019-01-01',
            'end_date' => '2020-12-31',
            'is_current' => false,
            'location' => 'Remote',
            'company_url' => 'https://startupxyz.com',
            'technologies' => ['Laravel', 'Vue.js', 'PostgreSQL', 'DigitalOcean'],
            'order' => 1,
            'slug' => 'full-stack-developer',
        ]);

        // Create Education
        Education::create([
            'user_id' => $user->id,
            'institution' => 'University of California',
            'degree' => 'Bachelor of Science',
            'field_of_study' => 'Computer Science',
            'start_date' => '2015-09-01',
            'end_date' => '2019-05-31',
            'is_current' => false,
            'description' => 'Focused on software engineering, web development, and artificial intelligence. Graduated with honors.',
            'grade' => '3.8 GPA',
            'location' => 'Berkeley, CA',
            'order' => 0,
        ]);

        // Create Certifications
        Certification::create([
            'user_id' => $user->id,
            'name' => 'AWS Certified Solutions Architect',
            'issuing_organization' => 'Amazon Web Services',
            'issue_date' => '2022-06-01',
            'expiry_date' => '2025-06-01',
            'credential_id' => 'AWS-12345',
            'credential_url' => 'https://aws.amazon.com/certification',
            'description' => 'Professional level certification for AWS solutions architecture. Expertise in designing distributed systems on AWS.',
            'order' => 0,
        ]);

        Certification::create([
            'user_id' => $user->id,
            'name' => 'Laravel Certified Developer',
            'issuing_organization' => 'Laravel',
            'issue_date' => '2021-03-15',
            'expiry_date' => null,
            'credential_id' => 'LAR-67890',
            'credential_url' => 'https://laravel.com/certification',
            'description' => 'Expert level Laravel framework certification. Demonstrated advanced knowledge of Laravel ecosystem.',
            'order' => 1,
        ]);
    }

    /**
     * Create a sample student profile
     */
    private function createStudentProfile(): void
    {
        $studentUser = User::firstOrCreate(
            ['email' => 'student@example.com'],
            [
                'name' => 'Alice Johnson',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'user_type_id' => UserType::where('slug', 'student')->first()->id,
            ]
        );

        UserProfile::updateOrCreate(
            ['user_id' => $studentUser->id],
            [
                'username' => 'alicej',
                'full_name' => 'Alice Johnson',
                'tagline' => 'Computer Science Student | Aspiring Software Engineer',
                'bio' => 'Third-year Computer Science student passionate about software development and machine learning. Looking for internship opportunities.',
                'location' => 'Boston, MA',
                'email' => 'student@example.com',
                
                // Flexible fields for student
                'user_type_id' => UserType::where('slug', 'student')->first()->id,
                'headline' => 'Computer Science Student at MIT',
                'current_status' => 'studying',
                'institution' => 'Massachusetts Institute of Technology',
                'field_of_interest' => 'Artificial Intelligence, Web Development',
                'custom_fields' => [
                    'gpa' => '3.9',
                    'major' => 'Computer Science',
                    'graduation_year' => '2025',
                    'current_semester' => 'Junior',
                    'student_id' => 'MIT2025001',
                    'courses' => ['Machine Learning', 'Data Structures', 'Algorithms', 'Web Development'],
                ],
                
                'is_public' => true,
                'show_email' => false,
                'show_phone' => false,
                'github_url' => 'https://github.com/alicej',
                'linkedin_url' => 'https://linkedin.com/in/alicejohnson',
            ]
        );
    }

    /**
     * Create a sample teacher profile
     */
    private function createTeacherProfile(): void
    {
        $teacherUser = User::firstOrCreate(
            ['email' => 'teacher@example.com'],
            [
                'name' => 'Dr. Sarah Wilson',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'user_type_id' => UserType::where('slug', 'teacher')->first()->id,
            ]
        );

        UserProfile::updateOrCreate(
            ['user_id' => $teacherUser->id],
            [
                'username' => 'sarahw',
                'full_name' => 'Dr. Sarah Wilson',
                'tagline' => 'Computer Science Professor | Researcher',
                'bio' => 'Professor of Computer Science with 10+ years of teaching experience. Specialized in algorithms and distributed systems.',
                'location' => 'Cambridge, MA',
                'email' => 'teacher@example.com',
                
                // Flexible fields for teacher
                'user_type_id' => UserType::where('slug', 'teacher')->first()->id,
                'headline' => 'Computer Science Professor at Harvard',
                'current_status' => 'teaching',
                'institution' => 'Harvard University',
                'field_of_interest' => 'Algorithms, Distributed Systems, Computer Science Education',
                'custom_fields' => [
                    'teaching_subjects' => ['Algorithms', 'Data Structures', 'Distributed Systems', 'Computer Architecture'],
                    'education_level' => 'University',
                    'certifications_count' => 8,
                    'years_teaching' => 12,
                    'research_interests' => ['Parallel Computing', 'Cloud Systems'],
                    'publications_count' => 25,
                ],
                
                'is_public' => true,
                'show_email' => true,
                'website' => 'https://faculty.harvard.edu/sarahwilson',
                'github_url' => 'https://github.com/sarahw',
                'linkedin_url' => 'https://linkedin.com/in/sarahwilson',
            ]
        );
    }

    /**
     * Create a sample freelancer profile
     */
    private function createFreelancerProfile(): void
    {
        $freelancerUser = User::firstOrCreate(
            ['email' => 'freelancer@example.com'],
            [
                'name' => 'Mike Chen',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'user_type_id' => UserType::where('slug', 'freelancer')->first()->id,
            ]
        );

        UserProfile::updateOrCreate(
            ['user_id' => $freelancerUser->id],
            [
                'username' => 'mikec',
                'full_name' => 'Mike Chen',
                'tagline' => 'Freelance Full Stack Developer | React & Node.js Specialist',
                'bio' => 'Independent full-stack developer helping startups build their MVP and scale their applications.',
                'location' => 'Remote',
                'email' => 'freelancer@example.com',
                
                // Flexible fields for freelancer
                'user_type_id' => UserType::where('slug', 'freelancer')->first()->id,
                'headline' => 'Freelance Full Stack Developer',
                'current_status' => 'freelancing',
                'institution' => 'Self-Employed',
                'field_of_interest' => 'Startup Development, SaaS Products, Web Applications',
                'custom_fields' => [
                    'specialties' => ['React', 'Node.js', 'MongoDB', 'AWS'],
                    'hourly_rate' => 75,
                    'portfolio_url' => 'https://mikechen.dev',
                    'clients_worked_with' => 23,
                    'projects_delivered' => 89,
                    'availability' => 'Open for new projects',
                ],
                
                'is_public' => true,
                'show_email' => true,
                'website' => 'https://mikechen.dev',
                'github_url' => 'https://github.com/mikec',
                'linkedin_url' => 'https://linkedin.com/in/mikechen',
            ]
        );
    }
}
