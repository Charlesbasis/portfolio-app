<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\UserType;
use App\Models\UserTypeField;
use App\Models\UserFieldValue;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    /**
     * Get public profile by username
     */
    public function showPublic($username)
    {
        try {
            $user = User::with(['profile', 'userType', 'userType.fields'])
                ->whereHas('profile', function ($query) use ($username) {
                    $query->where('username', $username);
                })
                ->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                ], 404);
            }

            $profile = $user->profile;

            if (!$profile || !$profile->is_public) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profile not found or is private',
                ], 404);
            }

            $profile->incrementViews();

            // Get dynamic field values for this user
            $dynamicFields = $this->getUserDynamicFields($user);

            // Build response data
            $responseData = array_merge($profile->toArray(), [
                'user_type' => $user->userType,
                'dynamic_fields' => $dynamicFields,
            ]);

            return response()->json([
                'success' => true,
                'data' => $responseData,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching public profile: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch profile',
            ], 500);
        }
    }
    
    /**
     * Get current user's profile
     */
    public function show(Request $request)
    {
        try {
            $user = $request->user()->load(['profile', 'userType', 'userType.fields']);
            
            $profile = $user->profile;
            
            if (!$profile) {
                $profile = $this->createDefaultProfile($user);
            }

            // Get dynamic field values
            $dynamicFields = $this->getUserDynamicFields($user);
            
            return response()->json([
                'success' => true,
                'data' => array_merge($profile->toArray(), [
                    'user_type' => $user->userType,
                    'dynamic_fields' => $dynamicFields
                ]),
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching user profile: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch profile',
            ], 500);
        }
    }
    
    /**
     * Update profile
     */
    public function update(Request $request)
    {
        try {
            $user = $request->user()->load('userType.fields');
            
            // Base validation rules
            $validationRules = $this->getBaseValidationRules($user->id);
            
            // Add dynamic field validation rules based on user type
            $dynamicFieldRules = $this->getDynamicFieldValidationRules($user->userType);
            
            // Merge all validation rules
            $allRules = array_merge($validationRules, $dynamicFieldRules);
            
            $validator = Validator::make($request->all(), $allRules);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Update user type if provided
            if ($request->has('user_type_id') && $request->user_type_id != $user->user_type_id) {
                $user->update(['user_type_id' => $request->user_type_id]);
                $user->refresh()->load('userType.fields');
            }
            
            // Update profile data
            $profileData = $validator->validated();
            unset($profileData['user_type_id']);
            
            // Handle custom_fields JSON data
            if ($request->has('custom_fields')) {
                $profileData['custom_fields'] = $request->input('custom_fields');
            }
            
            $profile = UserProfile::updateOrCreate(
                ['user_id' => $user->id],
                $profileData
            );

            // Handle dynamic fields
            if ($request->has('dynamic') && $user->userType) {
                $this->updateDynamicFields($user, $request->input('dynamic'));
            }
            
            // Reload with fresh data
            $user->refresh()->load(['profile', 'userType.fields']);
            $dynamicFields = $this->getUserDynamicFields($user);
            
            return response()->json([
                'success' => true,
                'data' => array_merge($profile->toArray(), [
                    'user_type' => $user->userType,
                    'dynamic_fields' => $dynamicFields
                ]),
                'message' => 'Profile updated successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating profile: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
            ], 500);
        }
    }
    
    /**
     * Upload avatar
     */
    public function uploadAvatar(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'avatar' => 'required|image|max:2048', // 2MB max
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }
            
            $profile = UserProfile::where('user_id', $request->user()->id)->firstOrFail();
            
            // Delete old avatar if exists
            if ($profile->avatar_url && !filter_var($profile->avatar_url, FILTER_VALIDATE_URL)) {
                Storage::disk('public')->delete($profile->avatar_url);
            }
            
            // Store new avatar
            $path = $request->file('avatar')->store('avatars', 'public');
            $profile->avatar_url = $path;
            $profile->save();
            
            return response()->json([
                'success' => true,
                'data' => ['avatar_url' => asset('storage/' . $path)],
                'message' => 'Avatar uploaded successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Error uploading avatar: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload avatar',
            ], 500);
        }
    }
    
    /**
     * Upload cover image
     */
    public function uploadCoverImage(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'cover_image' => 'required|image|max:5120', // 5MB max
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }
            
            $profile = UserProfile::where('user_id', $request->user()->id)->firstOrFail();
            
            // Delete old cover image if exists
            if ($profile->cover_image_url && !filter_var($profile->cover_image_url, FILTER_VALIDATE_URL)) {
                Storage::disk('public')->delete($profile->cover_image_url);
            }
            
            // Store new cover image
            $path = $request->file('cover_image')->store('covers', 'public');
            $profile->cover_image_url = $path;
            $profile->save();
            
            return response()->json([
                'success' => true,
                'data' => ['cover_image_url' => asset('storage/' . $path)],
                'message' => 'Cover image uploaded successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Error uploading cover image: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload cover image',
            ], 500);
        }
    }

    /**
     * Get public stats
     */
    public function publicStats(string $username): JsonResponse
    {
        try {
            // Find user by profile username instead of user table
            $profile = UserProfile::where('username', $username)->first();

            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profile not found'
                ], 404);
            }

            $user = $profile->user;

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            $stats = [
                'total_projects' => $user->projects()->count(),
                'total_skills' => $user->skills()->count(),
                'years_experience' => $profile->years_experience ?? 0,
                'happy_clients' => $user->testimonials()->count(),
                'profile_views' => $profile->profile_views ?? 0,
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            Log::error('Error fetching public stats: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch stats'
            ], 500);
        }
    }

    /**
     * Get available user types
     */
    public function getUserTypes()
    {
        try {
            $userTypes = UserType::where('is_active', true)
                ->with('fields')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $userTypes,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching user types: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user types',
            ], 500);
        }
    }

    /**
     * Get user profile with flexible fields
     */
    public function getProfileWithFlexibleFields(Request $request)
    {
        try {
            $user = $request->user()->load(['profile', 'userType']);
            $profile = $user->profile;

            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profile not found',
                ], 404);
            }

            // Get custom fields with proper typing
            $customFields = $profile->custom_fields ?? [];
            
            // Enhance response with display values for current_status
            $currentStatusDisplay = $this->getCurrentStatusDisplay($profile->current_status);

            return response()->json([
                'success' => true,
                'data' => [
                    'profile' => $profile,
                    'user_type' => $user->userType,
                    'flexible_fields' => [
                        'headline' => $profile->headline,
                        'current_status' => $profile->current_status,
                        'current_status_display' => $currentStatusDisplay,
                        'institution' => $profile->institution,
                        'field_of_interest' => $profile->field_of_interest,
                        'custom_fields' => $customFields,
                        'display_headline' => $profile->headline ?? $profile->job_title ?? 'No headline set',
                    ]
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching flexible profile fields: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch profile fields',
            ], 500);
        }
    }

    /**
     * Update flexible profile fields
     */
    public function updateFlexibleFields(Request $request)
    {
        try {
            $user = $request->user();
            $profile = UserProfile::where('user_id', $user->id)->firstOrFail();

            $validator = Validator::make($request->all(), [
                'headline' => 'nullable|string|max:200',
                'current_status' => 'nullable|in:studying,working,teaching,freelancing,researching,unemployed,seeking_opportunities,other',
                'institution' => 'nullable|string|max:255',
                'field_of_interest' => 'nullable|string|max:255',
                'custom_fields' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $profile->update($validator->validated());

            return response()->json([
                'success' => true,
                'data' => [
                    'headline' => $profile->headline,
                    'current_status' => $profile->current_status,
                    'institution' => $profile->institution,
                    'field_of_interest' => $profile->field_of_interest,
                    'custom_fields' => $profile->custom_fields,
                    'display_headline' => $profile->headline ?? $profile->job_title ?? 'No headline set',
                ],
                'message' => 'Flexible profile fields updated successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating flexible profile fields: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile fields',
            ], 500);
        }
    }

    // ==================== HELPER METHODS ====================

    /**
     * Get base validation rules
     */
    private function getBaseValidationRules($userId)
    {
        return [
            'username' => [
                'sometimes',
                'string',
                'max:255',
                'unique:user_profiles,username,' . $userId . ',user_id',
                function ($attribute, $value, $fail) {
                    if (User::where('email', $value)->exists()) {
                        $fail('This username is not available.');
                    }
                }
            ],
            'full_name' => 'sometimes|string|max:255',
            'tagline' => 'nullable|string|max:500',
            'bio' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|url',
            'github_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
            'phone' => 'nullable|string|max:20',
            
            // Existing fields (now nullable)
            'job_title' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'years_experience' => 'nullable|integer|min:0',
            
            // New flexible fields
            'headline' => 'nullable|string|max:200',
            'current_status' => 'nullable|in:studying,working,teaching,freelancing,researching,unemployed,seeking_opportunities,other',
            'institution' => 'nullable|string|max:255',
            'field_of_interest' => 'nullable|string|max:255',
            'custom_fields' => 'nullable|array',
            
            'availability_status' => 'nullable|in:available,busy,not_available',
            'is_public' => 'sometimes|boolean',
            'show_email' => 'sometimes|boolean',
            'show_phone' => 'sometimes|boolean',
            'user_type_id' => 'sometimes|exists:user_types,id',
        ];
    }

    /**
     * Get dynamic field validation rules based on user type
     */
    private function getDynamicFieldValidationRules($userType)
    {
        $dynamicFieldRules = [];

        if ($userType) {
            foreach ($userType->fields as $field) {
                $rule = [];
                
                if ($field->is_required) {
                    $rule[] = 'required';
                } else {
                    $rule[] = 'nullable';
                }

                // Convert data_type to validation rules
                switch ($field->data_type) {
                    case 'string':
                        $rule[] = 'string';
                        $rule[] = 'max:255';
                        break;
                    case 'text':
                        $rule[] = 'string';
                        break;
                    case 'integer':
                        $rule[] = 'integer';
                        break;
                    case 'boolean':
                        $rule[] = 'boolean';
                        break;
                    case 'email':
                        $rule[] = 'email';
                        break;
                    case 'url':
                        $rule[] = 'url';
                        break;
                    default:
                        $rule[] = 'string';
                }

                // Add custom validation rules if defined
                if ($field->validation_rules) {
                    $customRules = explode('|', $field->validation_rules);
                    $rule = array_merge($rule, $customRules);
                }

                $fieldKey = "dynamic.{$field->field_slug}";
                $dynamicFieldRules[$fieldKey] = $rule;
            }
        }

        return $dynamicFieldRules;
    }

    /**
     * Create default profile for user
     */
    private function createDefaultProfile(User $user)
    {
        return UserProfile::create([
            'user_id' => $user->id,
            'username' => $user->name ?? 'user' . $user->id,
            'full_name' => $user->name,
            'email' => $user->email,
            'is_public' => false,
            'show_email' => false,
            'show_phone' => false,
            // Initialize new flexible fields
            'headline' => null,
            'current_status' => null,
            'institution' => null,
            'field_of_interest' => null,
            'custom_fields' => null,
        ]);
    }

    /**
     * Get dynamic fields for a user
     */
    private function getUserDynamicFields(User $user)
    {
        if (!$user->userType) {
            return [];
        }

        $dynamicFields = [];
        $fieldValues = UserFieldValue::where('user_id', $user->id)
            ->with('field')
            ->get()
            ->keyBy('field.field_slug');

        foreach ($user->userType->fields as $field) {
            $value = $fieldValues->get($field->field_slug);
            
            $dynamicFields[] = [
                'field_slug' => $field->field_slug,
                'field_name' => $field->field_name,
                'data_type' => $field->data_type,
                'value' => $value ? $value->value : null,
                'is_required' => $field->is_required,
            ];
        }

        return $dynamicFields;
    }

    /**
     * Update dynamic fields for a user
     */
    private function updateDynamicFields(User $user, array $dynamicData)
    {
        foreach ($dynamicData as $fieldSlug => $value) {
            $field = UserTypeField::where('field_slug', $fieldSlug)
                ->where('user_type_id', $user->user_type_id)
                ->first();

            if ($field) {
                UserFieldValue::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'user_type_field_id' => $field->id,
                    ],
                    ['value' => $value]
                );
            }
        }
    }

    /**
     * Get display value for current_status
     */
    private function getCurrentStatusDisplay($status)
    {
        $statusMap = [
            'studying' => 'Studying',
            'working' => 'Working',
            'teaching' => 'Teaching',
            'freelancing' => 'Freelancing',
            'researching' => 'Researching',
            'unemployed' => 'Unemployed',
            'seeking_opportunities' => 'Seeking Opportunities',
            'other' => 'Other',
        ];

        return $statusMap[$status] ?? null;
    }

    /**
     * Get current status options for forms
     */
    public function getCurrentStatusOptions()
    {
        $options = [
            'studying' => 'Studying',
            'working' => 'Working',
            'teaching' => 'Teaching',
            'freelancing' => 'Freelancing',
            'researching' => 'Researching',
            'unemployed' => 'Unemployed',
            'seeking_opportunities' => 'Seeking Opportunities',
            'other' => 'Other',
        ];

        return response()->json([
            'success' => true,
            'data' => $options,
        ]);
    }
}
