<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompleteOnboardingRequest;
use App\Models\User;
use App\Models\UserType;
use App\Models\UserTypeField;
use App\Models\UserProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class OnboardingController extends Controller
{
    /**
     * Get available user types with their fields
     */
    public function getUserTypes(): JsonResponse
    {
        try {
            $userTypes = UserType::with(['fields' => function ($query) {
                $query->where('is_active', true)->orderBy('display_order');
            }])
                ->where('is_active', true)
                ->orderBy('display_order')
                ->get()
                ->map(function ($type) {
                    return [
                        'id' => $type->id,
                        'name' => $type->name,
                        'slug' => $type->slug,
                        'description' => $type->description,
                        'icon' => $type->icon ?? 'Users',
                        'color' => $type->color ?? 'blue',
                        'fields' => $type->fields->map(function ($field) {
                            return [
                                'id' => $field->id,
                                'field_name' => $field->field_name,
                                'field_slug' => $field->field_slug,
                                'data_type' => $field->data_type,
                                'validation_rules' => $field->validation_rules,
                                'is_required' => (bool)$field->is_required,
                                'placeholder' => $field->placeholder ?? '',
                                'options' => $field->options ?? null,
                                'description' => $field->description ?? '',
                            ];
                        })
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $userTypes
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch user types: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user types'
            ], 500);
        }
    }

    public function status(Request $request): JsonResponse
    {
        $user = $request->user();
        $userType = $user->userType;
        
        // Get user type specific fields
        $userTypeFields = $userType ? $userType->fields()->where('is_active', true)->get() : collect();
        
        return response()->json([
            'completed' => $user->onboarding_completed,
            'current_step' => $user->onboarding_step,
            'profile' => $user->profile,
            'user_type' => $userType,
            'user_type_fields' => $userTypeFields,
            'allowed_fields' => $userType ? $this->getDefaultAllowedFields($userType->slug) : [],
        ]);
    }

    public function complete(CompleteOnboardingRequest $request): JsonResponse
    {
        $user = $request->user();

        DB::transaction(function () use ($user, $request) {
            // Update user type if provided
            if ($request->has('user_type_id')) {
                $userType = UserType::find($request->input('user_type_id'));
                if ($userType) {
                    $user->update(['user_type_id' => $userType->id]);
                    $user->refresh(); // Refresh to get updated user type
                }
            }

            $userType = $user->userType;

            // Validate against user type specific rules if user type exists
            if ($userType) {
                $validationRules = $this->getUserTypeValidationRules($userType);
                $validator = Validator::make($request->all(), $validationRules);

                if ($validator->fails()) {
                    throw new \Illuminate\Validation\ValidationException($validator);
                }
            }

            // Get allowed fields for this user type
            $allowedFields = $userType ? $this->getDefaultAllowedFields($userType->slug) : [
                'full_name',
                'username',
                'job_title',
                'company',
                'location',
                'tagline',
                'bio'
            ];

            if ($request->has('activity_data')) {
                $activityData = $request->input('activity_data');

                switch ($userType->slug) {
                    case 'student':
                        if (!empty($activityData['title'])) {
                            $user->projects()->create([
                                'title' => $activityData['title'],
                                'description' => $activityData['description'] ?? '',
                                'project_type' => 'academic',
                                'course' => $activityData['course'] ?? null,
                            ]);
                        }
                        break;

                    case 'teacher':
                        if (!empty($activityData['title'])) {
                            $user->teachingMaterials()->create([
                                'title' => $activityData['title'],
                                'description' => $activityData['description'] ?? '',
                                'subject' => $activityData['subject'] ?? null,
                                'grade_level' => $activityData['grade_level'] ?? null,
                            ]);
                        }
                        break;

                    case 'professional':
                        if (!empty($activityData['title'])) {
                            $user->portfolioProjects()->create([
                                'title' => $activityData['title'],
                                'description' => $activityData['description'] ?? '',
                                'client' => $activityData['client'] ?? null,
                                'service_url' => $activityData['service_url'] ?? null,
                                'services' => $activityData['services'] ?? [],
                            ]);
                        }
                        break;

                    case 'freelancer':
                        if (!empty($activityData['title'])) {
                            $user->freelancerProjects()->create([
                                'title' => $activityData['title'],
                                'description' => $activityData['description'] ?? '',
                                'client' => $activityData['client'] ?? null,
                                'project_url' => $activityData['project_url'] ?? null,
                                'technologies' => $activityData['technologies'] ?? [],
                            ]);
                        }
                }
            }
            // Prepare base profile data
            $profileData = [
                'email' => $user->email,
                'is_public' => $request->input('is_public', true),
            ];

            // Add standard fields that exist in both request and allowed fields
            $standardFields = ['full_name', 'username', 'job_title', 'company', 'location', 'tagline', 'bio'];
            foreach ($standardFields as $field) {
                if (in_array($field, $allowedFields) && $request->has($field)) {
                    $profileData[$field] = $request->input($field);
                }
            }

            // Handle custom fields for user type
            $customFields = [];
            if ($userType) {
                $typeSpecificFields = array_diff($allowedFields, $standardFields);
                foreach ($typeSpecificFields as $field) {
                    if ($request->has($field)) {
                        $customFields[$field] = $request->input($field);
                    }
                }

                // Also include fields from UserTypeField that might not be in allowed_fields
                $userTypeFieldSlugs = $userType->fields->pluck('field_slug')->toArray();
                foreach ($userTypeFieldSlugs as $fieldSlug) {
                    if ($request->has($fieldSlug) && !in_array($fieldSlug, $standardFields)) {
                        $customFields[$fieldSlug] = $request->input($fieldSlug);
                    }
                }
            }

            // Store custom fields as JSON
            if (!empty($customFields)) {
                $profileData['custom_fields'] = $customFields;
            }

            // Update user profile with filtered data
            $user->profile()->updateOrCreate(
                ['user_id' => $user->id],
                $profileData
            );

            // Handle type-specific entity creation
            $this->handleTypeSpecificEntities($user, $request, $userType);

            // Handle user type specific additional data
            $this->handleTypeSpecificData($user, $request, $userType);

            $user->completedOnboarding();
        });

        $user->load(['profile', 'projects', 'skills', 'userType']);

        return response()->json([
            'message' => 'Onboarding completed successfully',
            'user' => $user,
            'user_type' => $user->userType
        ]);
    }

    public function checkUsername($username): JsonResponse
    {
        $exists = UserProfile::where('username', $username)->exists();
        
        return response()->json([
            'available' => !$exists,
            'username' => $username
        ]);
    }

    /**
     * Get default allowed fields based on user type slug
     */
    private function getDefaultAllowedFields(string $userTypeSlug): array
    {
        return match($userTypeSlug) {
            'student' => ['full_name', 'username', 'location', 'bio', 'grade_level'],
            'teacher' => ['full_name', 'username', 'job_title', 'location', 'bio', 'subject_specialty'],
            'professional' => ['full_name', 'username', 'job_title', 'company', 'location', 'tagline', 'bio', 'current_role', 'skills'],
            'freelancer' => ['full_name', 'username', 'job_title', 'company', 'location', 'tagline', 'bio', 'hourly_rate', 'portfolio_url'],
            default => ['full_name', 'username', 'job_title', 'company', 'location', 'tagline', 'bio']
        };
    }

    /**
     * Get validation rules for a specific user type
     */
    private function getUserTypeValidationRules(UserType $userType): array
    {
        $baseRules = [
            'user_type_id' => 'sometimes|exists:user_types,id',
            'full_name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:255|unique:user_profiles,username',
            'job_title' => 'sometimes|string|max:255',
            'company' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'tagline' => 'sometimes|string|max:255',
            'bio' => 'sometimes|string',
            'is_public' => 'sometimes|boolean',
        ];

        // Get rules from user type fields
        $typeRules = [];
        $userTypeFields = $userType->fields()->where('is_active', true)->get();
        
        foreach ($userTypeFields as $field) {
            $rule = $field->validation_rules;
            
            // Add required rule if field is marked as required
            if ($field->is_required) {
                if (strpos($rule, 'required') === false) {
                    $rule = 'required|' . $rule;
                }
            } else {
                if (strpos($rule, 'required') === false) {
                    $rule = 'sometimes|' . $rule;
                }
            }
            
            $typeRules[$field->field_slug] = $rule;
        }

        return array_merge($baseRules, $typeRules);
    }

    /**
     * Handle creation of type-specific entities
     */
    private function handleTypeSpecificEntities(User $user, Request $request, ?UserType $userType): void
    {
        if (!$userType) return;

        switch ($userType->slug) {
            case 'student':
                $this->handleStudentEntities($user, $request);
                break;
            case 'teacher':
                $this->handleTeacherEntities($user, $request);
                break;
            case 'professional':
                $this->handleProfessionalEntities($user, $request);
                break;
            case 'freelancer':
                $this->handleFreelancerEntities($user, $request);
                break;
        }
    }

    private function handleStudentEntities(User $user, Request $request): void
    {
        // Handle student-specific entities
        if ($request->has('courses')) {
            $courses = $request->input('courses');
            foreach ($courses as $courseData) {
                $user->studentCourses()->create([
                    'course_name' => $courseData['name'],
                    'institution' => $courseData['institution'] ?? null,
                    'start_date' => $courseData['start_date'] ?? null,
                    'end_date' => $courseData['end_date'] ?? null,
                ]);
            }
        }

        // Academic projects for students
        if ($request->has('academic_projects')) {
            $projects = $request->input('academic_projects');
            foreach ($projects as $projectData) {
                $user->academicProjects()->create([
                    'title' => $projectData['title'],
                    'description' => $projectData['description'] ?? null,
                    'subject' => $projectData['subject'] ?? null,
                    'grade' => $projectData['grade'] ?? null,
                ]);
            }
        }
    }

    private function handleTeacherEntities(User $user, Request $request): void
    {
        // Handle teacher-specific entities
        if ($request->has('subjects')) {
            $subjects = $request->input('subjects');
            foreach ($subjects as $subjectData) {
                $user->teacherSubjects()->create([
                    'name' => $subjectData['name'],
                    'level' => $subjectData['level'] ?? $request->input('teaching_level', 'general'),
                ]);
            }
        }

        if ($request->has('classes')) {
            $classes = $request->input('classes');
            foreach ($classes as $classData) {
                $user->teacherClasses()->create([
                    'name' => $classData['name'],
                    'grade_level' => $classData['grade_level'] ?? null,
                    'subject' => $classData['subject'] ?? null,
                ]);
            }
        }
    }

    private function handleProfessionalEntities(User $user, Request $request): void
    {
        // Handle professional-specific entities
        if ($request->has('skills')) {
            $skills = $request->input('skills');
            if (is_array($skills)) {
                foreach ($skills as $skillName) {
                    $user->skills()->create([
                        'name' => $skillName,
                        'category' => 'professional',
                        'proficiency' => 80,
                    ]);
                }
            }
        }

        // Professional experience
        if ($request->has('experience')) {
            $experienceData = $request->input('experience');
            $user->experiences()->create([
                'title' => $experienceData['title'] ?? 'Current Role',
                'company' => $experienceData['company'] ?? $request->input('company'),
                'description' => $experienceData['description'] ?? null,
                'start_date' => $experienceData['start_date'] ?? null,
                'end_date' => $experienceData['end_date'] ?? null,
                'is_current' => $experienceData['is_current'] ?? true,
            ]);
        }
    }

    private function handleFreelancerEntities(User $user, Request $request): void
    {
        // Handle freelancer-specific entities
        if ($request->has('services')) {
            $services = $request->input('services');
            foreach ($services as $serviceData) {
                $user->freelancerServices()->create([
                    'name' => $serviceData['name'],
                    'description' => $serviceData['description'] ?? null,
                    'category' => $serviceData['category'] ?? 'general',
                    'rate_type' => $serviceData['rate_type'] ?? 'hourly',
                    'rate' => $serviceData['rate'] ?? $request->input('hourly_rate'),
                ]);
            }
        }

        // Freelancer portfolio projects
        if ($request->has('portfolio_projects')) {
            $projects = $request->input('portfolio_projects');
            foreach ($projects as $projectData) {
                $user->portfolioProjects()->create([
                    'title' => $projectData['title'],
                    'description' => $projectData['description'] ?? null,
                    'client' => $projectData['client'] ?? null,
                    'project_url' => $projectData['project_url'] ?? null,
                    'technologies' => $projectData['technologies'] ?? [],
                ]);
            }
        }
    }

    private function handleTypeSpecificData(User $user, Request $request, ?UserType $userType): void
    {
        // This method can be used for additional data processing
        // that doesn't fit into entity creation
        if (!$userType) return;

        // Store any type-specific data in custom fields if needed
        $typeSpecificData = [];
        
        switch ($userType->slug) {
            case 'student':
                if ($request->has('grade_level')) {
                    $typeSpecificData['grade_level'] = $request->input('grade_level');
                }
                break;
                
            case 'teacher':
                if ($request->has('subject_specialty')) {
                    $typeSpecificData['subject_specialty'] = $request->input('subject_specialty');
                }
                break;
                
            case 'professional':
                if ($request->has('current_role')) {
                    $typeSpecificData['current_role'] = $request->input('current_role');
                }
                if ($request->has('skills')) {
                    $typeSpecificData['skills_list'] = is_array($request->input('skills')) 
                        ? $request->input('skills') 
                        : explode(',', $request->input('skills'));
                }
                break;
                
            case 'freelancer':
                if ($request->has('hourly_rate')) {
                    $typeSpecificData['hourly_rate'] = $request->input('hourly_rate');
                }
                if ($request->has('portfolio_url')) {
                    $typeSpecificData['portfolio_url'] = $request->input('portfolio_url');
                }
                break;
        }

        // Update custom fields with type-specific data
        if (!empty($typeSpecificData)) {
            $profile = $user->profile;
            $currentCustomFields = $profile->custom_fields ?? [];
            $profile->custom_fields = array_merge($currentCustomFields, $typeSpecificData);
            $profile->save();
        }
    }

    /**
     * Get step configuration for multi-step onboarding
     */
    public function getStepConfiguration(Request $request, $step): JsonResponse
    {
        $user = $request->user();
        $userType = $user->userType;
        
        $stepConfiguration = $this->getStepConfig($userType, $step);
        
        if (!$stepConfiguration) {
            return response()->json([
                'message' => 'Step not found'
            ], 404);
        }

        return response()->json([
            'step' => $stepConfiguration,
            'available_fields' => $userType ? $this->getDefaultAllowedFields($userType->slug) : [],
            'validation_rules' => $userType ? $this->getUserTypeValidationRules($userType) : [],
        ]);
    }

    /**
     * Get configuration for specific step
     */
    private function getStepConfig(?UserType $userType, int $step): ?array
    {
        if (!$userType) return null;

        $steps = match($userType->slug) {
            'student' => [
                1 => [
                    'step' => 1,
                    'title' => 'Basic Information',
                    'description' => 'Tell us about yourself',
                    'fields' => ['full_name', 'username', 'location', 'bio']
                ],
                2 => [
                    'step' => 2,
                    'title' => 'Academic Details',
                    'description' => 'Share your educational background',
                    'fields' => ['grade_level']
                ]
            ],
            'teacher' => [
                1 => [
                    'step' => 1,
                    'title' => 'Basic Information',
                    'description' => 'Tell us about yourself',
                    'fields' => ['full_name', 'username', 'job_title', 'location', 'bio']
                ],
                2 => [
                    'step' => 2,
                    'title' => 'Teaching Details',
                    'description' => 'Share your teaching expertise',
                    'fields' => ['subject_specialty']
                ]
            ],
            'professional' => [
                1 => [
                    'step' => 1,
                    'title' => 'Basic Information',
                    'description' => 'Tell us about yourself',
                    'fields' => ['full_name', 'username', 'job_title', 'company', 'location', 'tagline', 'bio']
                ],
                2 => [
                    'step' => 2,
                    'title' => 'Professional Details',
                    'description' => 'Share your professional background',
                    'fields' => ['current_role', 'skills']
                ]
            ],
            'freelancer' => [
                1 => [
                    'step' => 1,
                    'title' => 'Basic Information',
                    'description' => 'Tell us about yourself',
                    'fields' => ['full_name', 'username', 'job_title', 'company', 'location', 'tagline', 'bio']
                ],
                2 => [
                    'step' => 2,
                    'title' => 'Freelance Details',
                    'description' => 'Share your freelance information',
                    'fields' => ['hourly_rate', 'portfolio_url']
                ]
            ],
            default => [
                1 => [
                    'step' => 1,
                    'title' => 'Basic Information',
                    'description' => 'Tell us about yourself',
                    'fields' => ['full_name', 'username', 'job_title', 'company', 'location', 'tagline', 'bio']
                ]
            ]
        };

        return $steps[$step] ?? null;
    }
}
