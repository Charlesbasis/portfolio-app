<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UserType;
use App\Models\UserTypeField;

class UserTypeSeeder extends Seeder
{
    public function run()
    {
        $userTypes = [
            [
                'name' => 'Student',
                'slug' => 'student',
                'description' => 'Learning and building projects',
                'icon' => 'GraduationCap',
                'color' => 'blue',
                'display_order' => 1,
                'is_active' => true,
                'fields' => [
                    [
                        'field_name' => 'Grade Level',
                        'field_slug' => 'grade_level',
                        'data_type' => 'select',
                        'validation_rules' => 'required|string',
                        'is_required' => true,
                        'placeholder' => 'Select your grade level',
                        'options' => [
                            ['value' => 'high-school', 'label' => 'High School'],
                            ['value' => 'undergraduate', 'label' => 'Undergraduate'],
                            ['value' => 'graduate', 'label' => 'Graduate'],
                            ['value' => 'postgraduate', 'label' => 'Postgraduate'],
                        ],
                        'display_order' => 1,
                    ],
                    [
                        'field_name' => 'Institution',
                        'field_slug' => 'institution',
                        'data_type' => 'text',
                        'validation_rules' => 'nullable|string|max:200',
                        'is_required' => false,
                        'placeholder' => 'MIT',
                        'display_order' => 2,
                    ],
                    [
                        'field_name' => 'Major/Field of Study',
                        'field_slug' => 'major',
                        'data_type' => 'text',
                        'validation_rules' => 'nullable|string|max:200',
                        'is_required' => false,
                        'placeholder' => 'Computer Science',
                        'display_order' => 3,
                    ],
                    [
                        'field_name' => 'Expected Graduation',
                        'field_slug' => 'graduation_year',
                        'data_type' => 'number',
                        'validation_rules' => 'nullable|integer|min:2024|max:2035',
                        'is_required' => false,
                        'placeholder' => '2025',
                        'display_order' => 4,
                    ],
                ],
            ],
            [
                'name' => 'Teacher',
                'slug' => 'teacher',
                'description' => 'Sharing knowledge and teaching materials',
                'icon' => 'BookOpen',
                'color' => 'green',
                'display_order' => 2,
                'is_active' => true,
                'fields' => [
                    [
                        'field_name' => 'Subject Specialty',
                        'field_slug' => 'subject_specialty',
                        'data_type' => 'text',
                        'validation_rules' => 'required|string|max:200',
                        'is_required' => true,
                        'placeholder' => 'Mathematics, Physics, etc.',
                        'display_order' => 1,
                    ],
                    [
                        'field_name' => 'Teaching Level',
                        'field_slug' => 'teaching_level',
                        'data_type' => 'select',
                        'validation_rules' => 'required|string',
                        'is_required' => true,
                        'placeholder' => 'Select teaching level',
                        'options' => [
                            ['value' => 'elementary', 'label' => 'Elementary School'],
                            ['value' => 'middle', 'label' => 'Middle School'],
                            ['value' => 'high', 'label' => 'High School'],
                            ['value' => 'college', 'label' => 'College/University'],
                            ['value' => 'adult', 'label' => 'Adult Education'],
                        ],
                        'display_order' => 2,
                    ],
                    [
                        'field_name' => 'Years of Experience',
                        'field_slug' => 'years_experience',
                        'data_type' => 'number',
                        'validation_rules' => 'nullable|integer|min:0|max:50',
                        'is_required' => false,
                        'placeholder' => '5',
                        'display_order' => 3,
                    ],
                ],
            ],
            [
                'name' => 'Professional',
                'slug' => 'professional',
                'description' => 'Building production applications',
                'icon' => 'Code',
                'color' => 'purple',
                'display_order' => 3,
                'is_active' => true,
                'fields' => [
                    [
                        'field_name' => 'Current Role',
                        'field_slug' => 'current_role',
                        'data_type' => 'text',
                        'validation_rules' => 'required|string|max:200',
                        'is_required' => true,
                        'placeholder' => 'Senior Full Stack Developer',
                        'display_order' => 1,
                    ],
                    [
                        'field_name' => 'Years of Experience',
                        'field_slug' => 'years_experience',
                        'data_type' => 'number',
                        'validation_rules' => 'nullable|integer|min:0|max:50',
                        'is_required' => false,
                        'placeholder' => '5',
                        'display_order' => 2,
                    ],
                    [
                        'field_name' => 'Specialization',
                        'field_slug' => 'specialization',
                        'data_type' => 'select',
                        'validation_rules' => 'nullable|string',
                        'is_required' => false,
                        'options' => [
                            ['value' => 'frontend', 'label' => 'Frontend Development'],
                            ['value' => 'backend', 'label' => 'Backend Development'],
                            ['value' => 'fullstack', 'label' => 'Full Stack Development'],
                            ['value' => 'mobile', 'label' => 'Mobile Development'],
                            ['value' => 'devops', 'label' => 'DevOps Engineering'],
                            ['value' => 'data', 'label' => 'Data Engineering'],
                        ],
                        'display_order' => 3,
                    ],
                ],
            ],
            [
                'name' => 'Freelancer',
                'slug' => 'freelancer',
                'description' => 'Independent contractor and consultant',
                'icon' => 'Briefcase',
                'color' => 'orange',
                'display_order' => 4,
                'is_active' => true,
                'fields' => [
                    [
                        'field_name' => 'Hourly Rate (USD)',
                        'field_slug' => 'hourly_rate',
                        'data_type' => 'number',
                        'validation_rules' => 'nullable|integer|min:1|max:1000',
                        'is_required' => false,
                        'placeholder' => '75',
                        'display_order' => 1,
                    ],
                    [
                        'field_name' => 'Portfolio Website',
                        'field_slug' => 'portfolio_url',
                        'data_type' => 'url',
                        'validation_rules' => 'nullable|url',
                        'is_required' => false,
                        'placeholder' => 'https://yourportfolio.com',
                        'display_order' => 2,
                    ],
                    [
                        'field_name' => 'Primary Service',
                        'field_slug' => 'specialization',
                        'data_type' => 'select',
                        'validation_rules' => 'required|string',
                        'is_required' => true,
                        'options' => [
                            ['value' => 'web-dev', 'label' => 'Web Development'],
                            ['value' => 'mobile-dev', 'label' => 'Mobile Development'],
                            ['value' => 'design', 'label' => 'UI/UX Design'],
                            ['value' => 'consulting', 'label' => 'Technical Consulting'],
                            ['value' => 'full-service', 'label' => 'Full Service Development'],
                        ],
                        'display_order' => 3,
                    ],
                ],
            ],
        ];

        foreach ($userTypes as $typeData) {
            $fields = $typeData['fields'];
            unset($typeData['fields']);

            $userType = UserType::updateOrCreate(
                ['slug' => $typeData['slug']],
                $typeData
            );

            foreach ($fields as $fieldData) {
                UserTypeField::updateOrCreate(
                    [
                        'user_type_id' => $userType->id,
                        'field_slug' => $fieldData['field_slug']
                    ],
                    array_merge($fieldData, ['user_type_id' => $userType->id])
                );
            }
        }

        $this->command->info('User types seeded successfully!');
    }
}
