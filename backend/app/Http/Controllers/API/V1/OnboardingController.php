<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompleteOnboardingRequest;
use App\Models\User;
use App\Models\UserType;
use App\Models\UserTypeField;
use App\Models\UserProfile;
use App\Models\Projects;
use App\Models\Skills;
use App\Models\UserSkill;
use App\Models\Experience;
use App\Models\Service;
use App\Models\Education;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

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
            'current_step' => $user->onboarding_step ?? 1,
            'profile' => $user->profile,
            'user_type' => $userType,
            'user_type_fields' => $userTypeFields,
            'allowed_fields' => $userType ? $this->getDefaultAllowedFields($userType->slug) : [],
        ]);
    }

    public function complete(CompleteOnboardingRequest $request): JsonResponse
    {
        $user = $request->user();

        try {
            DB::transaction(function () use ($user, $request) {
                // 1. Update user type if provided
                if ($request->has('user_type_id')) {
                    $userType = UserType::find($request->input('user_type_id'));
                    if ($userType) {
                        $user->update(['user_type_id' => $userType->id]);
                        $user->refresh();
                    }
                }

                $userType = $user->userType;

                // 2. Save User Type Fields (GPA, Institution, etc.)
                if ($userType && $request->has('user_type_fields')) {
                    $this->saveUserTypeFields($user, $request->input('user_type_fields'));
                }

                // 3. Create User Profile
                $this->saveUserProfile($user, $request, $userType);

                // 4. Save Projects (CRITICAL - This was missing!)
                if ($request->has('projects')) {
                    $this->saveProjects($user, $request->input('projects'));
                } elseif ($request->has('project')) {
                    // Handle single project from onboarding
                    $this->saveProjects($user, [$request->input('project')]);
                }

                // 5. Save Skills (CRITICAL - This was missing!)
                if ($request->has('skills')) {
                    $this->saveSkills($user, $request->input('skills'));
                }

                // 6. Save Experience (CRITICAL - This was missing!)
                if ($request->has('experiences')) {
                    $this->saveExperiences($user, $request->input('experiences'));
                } elseif ($request->has('experience')) {
                    $this->saveExperiences($user, [$request->input('experience')]);
                }

                // 7. Save Education
                if ($request->has('education')) {
                    $this->saveEducation($user, $request->input('education'));
                }

                // 8. Save Services
                if ($request->has('services')) {
                    $this->saveServices($user, $request->input('services'));
                }

                // 9. Handle type-specific data (legacy support)
                if ($userType) {
                    $this->handleTypeSpecificEntities($user, $request, $userType);
                }

                // 10. Mark onboarding as completed
                $user->update([
                    'onboarding_completed' => true,
                    'onboarding_completed_at' => now(),
                ]);

                // 11. Clear any cached dashboard stats
                Cache::forget('dashboard:stats:' . $user->id);

                Log::info('Onboarding completed successfully', [
                    'user_id' => $user->id,
                    'projects_count' => Projects::where('user_id', $user->id)->count(),
                    'skills_count' => UserSkill::where('user_id', $user->id)->count(),
                    'experiences_count' => Experience::where('user_id', $user->id)->count(),
                ]);
            });

            $user->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Onboarding completed successfully',
                'user' => array_merge($user->toArray(), [
                    'onboarding_completed' => (bool)$user->onboarding_completed
                ]),
                'onboarding_completed' => (bool)$user->onboarding_completed,
                'onboarding_completed_at' => $user->onboarding_completed_at,
                'stats' => [
                    'projects' => Projects::where('user_id', $user->id)->count(),
                    'skills' => UserSkill::where('user_id', $user->id)->count(),
                    'experiences' => Experience::where('user_id', $user->id)->count(),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Onboarding completion failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to complete onboarding: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Save user type specific fields (GPA, institution, etc.)
     */
    private function saveUserTypeFields($user, $fields)
    {
        if (!$user->user_type_id || !is_array($fields)) {
            return;
        }

        foreach ($fields as $fieldSlug => $value) {
            $fieldDef = UserTypeField::where('field_slug', $fieldSlug)
                ->where('user_type_id', $user->user_type_id)
                ->first();
            
            if ($fieldDef) {
                DB::table('user_field_values')->updateOrInsert(
                    [
                        'user_id' => $user->id,
                        'user_type_field_id' => $fieldDef->id
                    ],
                    [
                        'value' => $value,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }

    /**
     * Save user profile
     */
    private function saveUserProfile($user, Request $request, $userType)
    {
        $allowedFields = $userType ? $this->getDefaultAllowedFields($userType->slug) : [
            'full_name', 'username', 'job_title', 'company', 'location', 'tagline', 'bio'
        ];

        $profileData = [
            'email' => $user->email,
            'is_public' => $request->input('is_public', true),
        ];

        // Add standard fields
        $standardFields = ['full_name', 'username', 'job_title', 'company', 'location', 'tagline', 'bio'];
        foreach ($standardFields as $field) {
            if (in_array($field, $allowedFields) && $request->has($field)) {
                $profileData[$field] = $request->input($field);
            }
        }

        // Handle custom fields
        $customFields = [];
        if ($userType) {
            $typeSpecificFields = array_diff($allowedFields, $standardFields);
            foreach ($typeSpecificFields as $field) {
                if ($request->has($field)) {
                    $customFields[$field] = $request->input($field);
                }
            }

            $userTypeFieldSlugs = $userType->fields->pluck('field_slug')->toArray();
            foreach ($userTypeFieldSlugs as $fieldSlug) {
                if ($request->has($fieldSlug) && !in_array($fieldSlug, $standardFields)) {
                    $customFields[$fieldSlug] = $request->input($fieldSlug);
                }
            }
        }

        if (!empty($customFields)) {
            $profileData['custom_fields'] = $customFields;
        }

        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $profileData
        );
    }

    /**
     * Save projects from onboarding
     */
    private function saveProjects($user, $projects)
    {
        if (!is_array($projects)) {
            return;
        }

        foreach ($projects as $projectData) {
            // Skip if no title
            if (empty($projectData['title'])) {
                continue;
            }

            Projects::create([
                'user_id' => $user->id,
                'title' => $projectData['title'],
                'slug' => Str::slug($projectData['title']) . '-' . uniqid(),
                'description' => $projectData['description'] ?? null,
                'status' => $projectData['status'] ?? 'published',
                'type' => $projectData['type'] ?? 'personal_project',
                'featured' => $projectData['featured'] ?? false,
                'technologies' => $projectData['technologies'] ?? [],
                'github_url' => $projectData['github_url'] ?? null,
                'live_url' => $projectData['live_url'] ?? null,
            ]);
        }
    }

    /**
     * Save skills from onboarding
     */
    private function saveSkills($user, $skills)
    {
        if (!is_array($skills)) {
            return;
        }

        $proficiencyMap = [
            'beginner' => 25,
            'intermediate' => 50,
            'advanced' => 75,
            'expert' => 90
        ];

        foreach ($skills as $skillData) {
            $skillName = is_array($skillData) ? ($skillData['name'] ?? null) : $skillData;
            
            if (empty($skillName)) {
                continue;
            }

            // Find or create the skill
            $skill = Skills::firstOrCreate(
                ['slug' => Str::slug($skillName)],
                [
                    'name' => $skillName,
                    'category' => is_array($skillData) ? ($skillData['category'] ?? 'other') : 'other',
                    'proficiency' => is_array($skillData) && isset($skillData['proficiency']) 
                        ? $proficiencyMap[$skillData['proficiency']] ?? 50 
                        : 50,
                ]
            );

            // Create user-skill relationship
            UserSkill::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'skill_id' => $skill->id
                ],
                [
                    'proficiency' => is_array($skillData) ? ($skillData['proficiency'] ?? 'intermediate') : 'intermediate',
                    'years_experience' => is_array($skillData) ? ($skillData['years_experience'] ?? 0) : 0,
                ]
            );
        }
    }

    /**
     * Save work experiences from onboarding
     */
    private function saveExperiences($user, $experiences)
    {
        if (!is_array($experiences)) {
            return;
        }

        foreach ($experiences as $index => $experienceData) {
            if (empty($experienceData['company']) || empty($experienceData['position'])) {
                continue;
            }

            Experience::create([
                'user_id' => $user->id,
                'company' => $experienceData['company'],
                'position' => $experienceData['position'],
                'description' => $experienceData['description'] ?? null,
                'is_current' => $experienceData['is_current'] ?? false,
                'start_date' => $experienceData['start_date'] ?? now()->subYear(),
                'end_date' => $experienceData['end_date'] ?? null,
                'slug' => Str::slug($experienceData['position'] . '-' . $experienceData['company']) . '-' . uniqid(),
                'location' => $experienceData['location'] ?? null,
                'company_url' => $experienceData['company_url'] ?? null,
                'technologies' => $experienceData['technologies'] ?? [],
                'order' => $index,
            ]);
        }
    }

    /**
     * Save education from onboarding
     */
    private function saveEducation($user, $educations)
    {
        if (!is_array($educations)) {
            return;
        }

        foreach ($educations as $index => $educationData) {
            if (empty($educationData['institution'])) {
                continue;
            }

            Education::create([
                'user_id' => $user->id,
                'institution' => $educationData['institution'],
                'title' => $educationData['title'] ?? 'Degree',
                'field_or_department' => $educationData['field_or_department'] ?? $educationData['field'] ?? null,
                'role' => $educationData['role'] ?? 'student',
                'is_current' => $educationData['is_current'] ?? false,
                'start_date' => $educationData['start_date'] ?? now()->subYears(2),
                'end_date' => $educationData['end_date'] ?? null,
                'description' => $educationData['description'] ?? null,
                'grade' => $educationData['grade'] ?? null,
                'location' => $educationData['location'] ?? null,
                'order' => $index,
            ]);
        }
    }

    /**
     * Save services from onboarding
     */
    private function saveServices($user, $services)
    {
        if (!is_array($services)) {
            return;
        }

        foreach ($services as $serviceData) {
            if (empty($serviceData['title'])) {
                continue;
            }

            Service::create([
                'user_id' => $user->id,
                'title' => $serviceData['title'],
                'slug' => Str::slug($serviceData['title']) . '-' . $user->id . '-' . uniqid(),
                'description' => $serviceData['description'] ?? '',
                'features' => $serviceData['features'] ?? [],
                'category' => $serviceData['category'] ?? 'general',
            ]);
        }
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
     * Handle creation of type-specific entities (legacy support)
     */
    private function handleTypeSpecificEntities(User $user, Request $request, ?UserType $userType): void
    {
        if (!$userType) return;

        // This is kept for backward compatibility but the new save methods above are preferred
        switch ($userType->slug) {
            case 'student':
                // Additional student-specific logic if needed
                break;
            case 'teacher':
                // Additional teacher-specific logic if needed
                break;
            case 'professional':
                // Additional professional-specific logic if needed
                break;
            case 'freelancer':
                // Additional freelancer-specific logic if needed
                break;
        }
    }
}
