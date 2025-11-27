<?php

namespace Database\Seeders;

use App\Models\Projects;
use App\Models\Skills;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\User;
use App\Models\UserType;
use App\Models\UserTypeField;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserDataSeeder extends Seeder
{
    public function run(): void
    {
        $userType = UserType::where('slug', 'student')->first();

        $user = User::firstOrCreate(
            ['email' => 'your-email@example.com'],
            [
                'name' => 'Your Name',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'user_type_id' => $userType?->id, 
            ]
        );

        // Ensure existing users get the type update if re-seeding
        if ($userType && $user->user_type_id !== $userType->id) {
            $user->update(['user_type_id' => $userType->id]);
        }

        $userId = $user->id;

        if ($userType) {
            $gpaField = UserTypeField::where('field_slug', 'gpa')->first();
            $semesterField = UserTypeField::where('field_slug', 'current_semester')->first();

            // Insert GPA
            if ($gpaField) {
                DB::table('user_field_values')->updateOrInsert(
                    ['user_id' => $userId, 'user_type_field_id' => $gpaField->id],
                    ['value' => '3.8', 'created_at' => now(), 'updated_at' => now()]
                );
            }

            // Insert Semester
            if ($semesterField) {
                DB::table('user_field_values')->updateOrInsert(
                    ['user_id' => $userId, 'user_type_field_id' => $semesterField->id],
                    ['value' => '6', 'created_at' => now(), 'updated_at' => now()]
                );
            }
        }

        Projects::updateOrCreate(
            ['slug' => 'shopping-platform'],
            [
                'user_id' => $userId,
                'title' => 'Shopping Platform',
                'description' => 'A full-featured online shopping platform',
                'technologies' => ['React', 'MySQL'],
                'featured' => true,
                'status' => 'published',
                'type' => 'personal_project', 
            ]
        );
        
        Projects::create([
            'user_id' => $userId,
            'title' => 'Data Structures Final',
            'slug' => 'ds-final',
            'description' => 'Binary tree implementation',
            'technologies' => ['C++'],
            'featured' => false,
            'status' => 'published',
            'type' => 'assignment', 
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
