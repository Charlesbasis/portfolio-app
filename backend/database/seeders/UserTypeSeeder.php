<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UserType;
use App\Models\UserTypeField;

class UserTypeSeeder extends Seeder
{
    public function run(): void
    {
        // Create user types
        $student = UserType::create([
            'name' => 'Student',
            'slug' => 'student',
            'description' => 'System user with student role',
            'is_active' => true,
        ]);

        $teacher = UserType::create([
            'name' => 'Teacher',
            'slug' => 'teacher',
            'description' => 'System user with teacher role',
            'is_active' => true,
        ]);

        // Add dynamic fields for student type
        UserTypeField::create([
            'user_type_id' => $student->id,
            'field_name' => 'Grade Level',
            'field_slug' => 'grade_level',
            'data_type' => 'string',
            'validation_rules' => 'string|max:50',
            'is_required' => true,
        ]);

        // Add dynamic fields for teacher type
        UserTypeField::create([
            'user_type_id' => $teacher->id,
            'field_name' => 'Subject Specialty',
            'field_slug' => 'subject_specialty',
            'data_type' => 'string',
            'validation_rules' => 'string|max:100',
            'is_required' => true,
        ]);
    }
}
