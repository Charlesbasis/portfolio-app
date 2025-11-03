<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\UserType;
use App\Models\UserTypeField;
use App\Models\UserFieldValue;
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
        $user = User::with(['profile', 'userType', 'userType.fields'])
            ->whereHas('profile', function ($query) use ($username) {
                $query->where('username', $username);
            })
            ->first();

        if (!$user) {
            abort(404, 'User not found');
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

        return response()->json([
            'success' => true,
            'data' => array_merge($profile->toArray(), [
                'user_type' => $user->userType,
                'dynamic_fields' => $dynamicFields
            ]),
        ]);
    }
    
    /**
     * Get current user's profile
     */
    public function show(Request $request)
    {
        $user = $request->user()->load(['profile', 'userType', 'userType.fields']);
        
        $profile = $user->profile;
        
        if (!$profile) {
            // Create default profile if doesn't exist
            $profile = UserProfile::create([
                'user_id' => $user->id,
                'username' => $user->name ?? 'user' . $user->id,
                'full_name' => $user->name,
                'email' => $user->email,
                'is_public' => false,
                'show_email' => false,
                'show_phone' => false,
            ]);
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
    }
    
    /**
     * Update profile
     */
    public function update(Request $request)
    {
        $user = $request->user()->load('userType.fields');
        
        // Base validation rules
        $validationRules = [
            'username' => [
                'sometimes',
                'string',
                'max:255',
                'unique:user_profiles,username,' . $user->id . ',user_id',
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
            'job_title' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'years_experience' => 'nullable|integer|min:0',
            'availability_status' => 'nullable|in:available,busy,not_available',
            'is_public' => 'sometimes|boolean',
            'show_email' => 'sometimes|boolean',
            'show_phone' => 'sometimes|boolean',
            'user_type_id' => 'sometimes|exists:user_types,id',
        ];

        // Add dynamic field validation rules based on user type
        $dynamicFieldRules = [];
        $dynamicFieldData = [];

        if ($user->userType) {
            foreach ($user->userType->fields as $field) {
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
        unset($profileData['user_type_id']); // Remove user_type_id from profile data
        
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
    }
    
    /**
     * Upload avatar
     */
    public function uploadAvatar(Request $request)
    {
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
    }
    
    /**
     * Upload cover image
     */
    public function uploadCoverImage(Request $request)
    {
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
    }

    /**
     * Get public stats
     */
    public function publicStats($username)
    {
        $user = User::with(['profile', 'userType'])
            ->whereHas('profile', function ($query) use ($username) {
                $query->where('username', $username);
            })
            ->firstOrFail();

        $profile = $user->profile;

        // if (!$profile->is_public) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Profile is private',
        //     ], 403);
        // }

        $stats = [
            'total_projects' => $user->projects()->where('status', 'published')->count(),
            'total_skills' => $user->skills()->count(),
            'years_experience' => $profile->years_experience ?? 0,
            'total_experiences' => $user->experiences()->count(),
            'profile_views' => $profile->profile_views ?? 0,
            'user_type' => $user->userType->name ?? 'Not set',
            // 'happy_clients' => $user->testimonials()->where('slug', 'happy-client')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Get available user types
     */
    public function getUserTypes()
    {
        $userTypes = UserType::where('is_active', true)
            ->with('fields')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $userTypes,
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
}
