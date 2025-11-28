<?php

namespace Database\Seeders;

use App\Models\Education;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EducationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();

        // Student education entries
        Education::create([
            'user_id' => $user->id,
            'institution' => 'University of Technology',
            'title' => 'Bachelor of Science',
            'field_or_department' => 'Computer Science',
            'start_date' => '2018-09-01',
            'end_date' => '2022-05-30',
            'is_current' => false,
            'description' => 'Focused on software engineering and machine learning',
            'grade' => '3.8/4.0',
            'location' => 'New York, USA',
            'role' => 'student',
            'order' => 1,
        ]);

        Education::create([
            'user_id' => $user->id,
            'institution' => 'Coding Bootcamp',
            'title' => 'Full Stack Development',
            'field_or_department' => 'Web Development',
            'start_date' => '2022-06-01',
            'end_date' => '2022-08-30',
            'is_current' => false,
            'description' => 'Intensive full-stack web development program',
            'location' => 'San Francisco, USA',
            'role' => 'student',
            'order' => 2,
        ]);

        // Teacher education entries
        Education::create([
            'user_id' => $user->id,
            'institution' => 'University of Technology',
            'title' => 'Guest Lecturer',
            'field_or_department' => 'Computer Science Department',
            'position' => 'Guest Lecturer',
            'start_date' => '2023-01-15',
            'end_date' => '2023-05-15',
            'is_current' => false,
            'description' => 'Taught advanced web development concepts',
            'responsibilities' => 'Delivered lectures on modern web frameworks, mentored students on final projects, conducted workshops on Laravel and Vue.js',
            'location' => 'New York, USA',
            'role' => 'teacher',
            'order' => 3,
        ]);

        Education::create([
            'user_id' => $user->id,
            'institution' => 'Online Learning Platform',
            'title' => 'Course Instructor',
            'field_or_department' => 'Software Development',
            'position' => 'Senior Instructor',
            'start_date' => '2022-09-01',
            'is_current' => true,
            'description' => 'Teaching full-stack development online',
            'responsibilities' => 'Develop curriculum, create video content, mentor students, conduct code reviews, and host live Q&A sessions',
            'location' => 'Remote',
            'role' => 'teacher',
            'order' => 4
        ]);
    }
}
