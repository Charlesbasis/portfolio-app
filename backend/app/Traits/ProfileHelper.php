<?php

namespace App\Traits;

trait ProfileHelper
{
    public static function getCurrentStatusOptions()
    {
        return [
            'studying' => 'Studying',
            'working' => 'Working',
            'teaching' => 'Teaching',
            'freelancing' => 'Freelancing',
            'researching' => 'Researching',
            'unemployed' => 'Unemployed',
            'seeking_opportunities' => 'Seeking Opportunities',
            'other' => 'Other',
        ];
    }

    public static function getCustomFieldTemplates()
    {
        return [
            'student' => [
                'gpa' => 'GPA',
                'major' => 'Major',
                'graduation_year' => 'Graduation Year',
                'current_semester' => 'Current Semester',
            ],
            'professional' => [
                'current_role' => 'Current Role',
                'skills' => 'Skills',
                'certifications' => 'Certifications',
                'projects' => 'Projects',
            ],
            'teacher' => [
                'teaching_subjects' => 'Teaching Subjects',
                'education_level' => 'Education Level',
                'certifications_count' => 'Certifications Count',
            ],
            'freelancer' => [
                'specialties' => 'Specialties',
                'hourly_rate' => 'Hourly Rate',
                'portfolio_url' => 'Portfolio URL',
            ],
        ];
    }
}
