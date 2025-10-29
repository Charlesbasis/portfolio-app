<?php

namespace Database\Seeders;

use App\Models\Projects;
use App\Models\Skills;
use App\Models\Service;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class UserDataSeeder extends Seeder
{
    public function run(): void
    {
        // Get your current user ID (change this to your actual user ID)
        $userId = 2; // or whatever your authenticated user ID is

        Projects::create([
            'user_id' => $userId,
            'title' => 'Shopping Platform',
            'slug' => 'shopping-platform',
            'description' => 'A full-featured online shopping platform',
            'technologies' => ['React', 'MySQL'],
            'featured' => true,
            'status' => 'published',
        ]);

        Skills::create([
            'user_id' => $userId,
            'name' => 'PHP',
            'category' => 'backend',
            'proficiency' => 99,
            'slug' => 'php',
        ]);

        Service::create([
            'user_id' => $userId,
            'title' => 'backend development',
            'slug' => 'backend-development',
            'description' => 'Creating interfaces for backend functionality',
            'features' => ['REST API', 'Database Integration', 'Authentication'],
        ]);

        Testimonial::create([
            'user_id' => $userId,
            'name' => 'Jonathan Doe',
            'role' => 'Founder',
            'content' => 'Great work! The project was completed on time and met all requirements.',
            'slug' => 'jonathan-doe',
        ]);
    }
}
