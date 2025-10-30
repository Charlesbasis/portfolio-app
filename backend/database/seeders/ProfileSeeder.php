<?php

namespace Database\Seeders;

use App\Models\Certification;
use App\Models\Education;
use App\Models\Experience;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        
        if (!$user) {
            $user = User::create([
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
        }

        // Create Profile
        UserProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'username' => 'johndoe',
                'full_name' => 'John Doe',
                'tagline' => 'Full Stack Developer | Laravel & React Specialist',
                'bio' => 'Passionate developer with 5+ years of experience building modern web applications.',
                'location' => 'San Francisco, CA',
                'website' => 'https://johndoe.com',
                'email' => $user->email,
                'job_title' => 'Senior Full Stack Developer',
                'company' => 'Tech Corp',
                'years_experience' => 5,
                'availability_status' => 'available',
                'is_public' => true,
                'show_email' => true,
                'show_phone' => false,
                'github_url' => 'https://github.com/johndoe',
                'linkedin_url' => 'https://linkedin.com/in/johndoe',
                'twitter_url' => 'https://twitter.com/johndoe',
            ]
        );

        // Create Experience
        Experience::create([
            'user_id' => $user->id,
            'company' => 'Tech Corp',
            'position' => 'Senior Full Stack Developer',
            'description' => 'Leading development of enterprise web applications.',
            'start_date' => '2021-01-01',
            'end_date' => null,
            'is_current' => true,
            'location' => 'San Francisco, CA',
            'company_url' => 'https://techcorp.com',
            'technologies' => ['Laravel', 'React', 'MySQL', 'AWS'],
            'order' => 0,
            'slug' => 'senior-full-stack-developer',
        ]);

        Experience::create([
            'user_id' => $user->id,
            'company' => 'StartupXYZ',
            'position' => 'Full Stack Developer',
            'description' => 'Built scalable web applications from scratch.',
            'start_date' => '2019-01-01',
            'end_date' => '2020-12-31',
            'is_current' => false,
            'location' => 'Remote',
            'company_url' => 'https://startupxyz.com',
            'technologies' => ['Laravel', 'Vue.js', 'PostgreSQL'],
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
            'description' => 'Focused on software engineering and web development.',
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
            'description' => 'Professional level certification for AWS solutions architecture.',
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
            'description' => 'Expert level Laravel framework certification.',
            'order' => 1,
        ]);
    }
}
