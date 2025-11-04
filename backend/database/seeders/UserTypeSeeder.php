<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UserType;
use App\Models\UserTypeField;

class UserTypeSeeder extends Seeder
{
    public function run(): void
    {
        // Create user types using firstOrCreate to avoid duplicates
        $student = UserType::firstOrCreate(
            ['slug' => 'student'],
            [
                'name' => 'Student',
                'description' => 'System user with student role',
                'is_active' => true,
            ]
        );

        $teacher = UserType::firstOrCreate(
            ['slug' => 'teacher'],
            [
                'name' => 'Teacher', 
                'description' => 'System user with teacher role',
                'is_active' => true,
            ]
        );

        $professional = UserType::firstOrCreate(
            ['slug' => 'professional'],
            [
                'name' => 'Professional',
                'description' => 'Working professional in industry',
                'is_active' => true,
            ]
        );

        $freelancer = UserType::firstOrCreate(
            ['slug' => 'freelancer'],
            [
                'name' => 'Freelancer',
                'description' => 'Independent contractor or consultant',
                'is_active' => true,
            ]
        );

        // Add dynamic fields for student type
        UserTypeField::firstOrCreate(
            [
                'user_type_id' => $student->id,
                'field_slug' => 'grade_level',
            ],
            [
                'field_name' => 'Grade Level',
                'data_type' => 'string',
                'validation_rules' => 'string|max:50',
                'is_required' => true,
            ]
        );

        // Add dynamic fields for teacher type
        UserTypeField::firstOrCreate(
            [
                'user_type_id' => $teacher->id,
                'field_slug' => 'subject_specialty',
            ],
            [
                'field_name' => 'Subject Specialty',
                'data_type' => 'string',
                'validation_rules' => 'string|max:100',
                'is_required' => true,
            ]
        );

        // Add additional fields for professional type
        UserTypeField::firstOrCreate(
            [
                'user_type_id' => $professional->id,
                'field_slug' => 'current_role',
            ],
            [
                'field_name' => 'Current Role',
                'data_type' => 'string',
                'validation_rules' => 'string|max:100',
                'is_required' => false,
            ]
        );

        UserTypeField::firstOrCreate(
            [
                'user_type_id' => $professional->id,
                'field_slug' => 'skills',
            ],
            [
                'field_name' => 'Skills',
                'data_type' => 'text',
                'validation_rules' => 'string',
                'is_required' => false,
            ]
        );

        // Add additional fields for freelancer type
        UserTypeField::firstOrCreate(
            [
                'user_type_id' => $freelancer->id,
                'field_slug' => 'hourly_rate',
            ],
            [
                'field_name' => 'Hourly Rate',
                'data_type' => 'integer',
                'validation_rules' => 'integer|min:0',
                'is_required' => false,
            ]
        );

        UserTypeField::firstOrCreate(
            [
                'user_type_id' => $freelancer->id,
                'field_slug' => 'portfolio_url',
            ],
            [
                'field_name' => 'Portfolio URL',
                'data_type' => 'url',
                'validation_rules' => 'url',
                'is_required' => false,
            ]
        );
    }
}
