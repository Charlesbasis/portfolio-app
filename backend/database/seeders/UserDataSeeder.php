<?php

namespace Database\Seeders;

use App\Models\Education;
use App\Models\Projects;
use App\Models\Skills;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\User;
use App\Models\UserSkill;
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

        if ($userType) {
            $user->update(['user_type_id' => $userType->id]);
        }

        $userId = $user->id;

        if ($userType) {
            $fields = [
                'gpa' => '3.8',
                'current_semester' => '6'
            ];

            foreach ($fields as $slug => $value) {
                $fieldDef = UserTypeField::where('field_slug', $slug)->first();
                if ($fieldDef) {
                    DB::table('user_field_values')->updateOrInsert(
                        ['user_id' => $userId, 'user_type_field_id' => $fieldDef->id],
                        ['value' => $value, 'created_at' => now(), 'updated_at' => now()]
                    );
                }
            }
        }

        Education::create([
            'user_id' => $userId,
            'institution' => 'Tech University',
            'title' => 'Computer Science',
            'field_or_department' => 'Computer Science',
            'role' => 'student',
            'is_current' => true,
            'start_date' => now()->subYears(2),
        ]);

        Projects::create([
            'user_id' => $userId,
            'title' => 'Data Structures Final',
            'slug' => 'ds-final',
            'description' => 'Binary Trees',
            'status' => 'published',
            'type' => 'assignment', // REQUIRED
            'featured' => false,
        ]);

        Projects::create([
            'user_id' => $userId,
            'title' => 'Personal Portfolio',
            'slug' => 'portfolio',
            'description' => 'My site',
            'status' => 'published',
            'type' => 'personal_project', // REQUIRED
            'featured' => true,
        ]);

        $skill = Skills::firstOrCreate(['name' => 'Laravel'], ['slug' => 'laravel', 'category' => 'backend']);

        if (class_exists(UserSkill::class)) {
            UserSkill::create([
                'user_id' => $userId,
                'skill_id' => $skill->id,
                'proficiency' => 'expert'
            ]);
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
