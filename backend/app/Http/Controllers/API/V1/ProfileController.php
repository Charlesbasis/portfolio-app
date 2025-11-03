<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserProfile;
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
        // Log::debug('Searching for username:', ['username' => $username]);

        $user = User::whereHas('profile', function ($query) use ($username) {
            $query->where('username', $username);
        })->first();

        if (!$user) {
            abort(404, 'User not found');
        }

        $profile = UserProfile::where('user_id', $user->id)->first();

        if (!$profile || !$profile->is_public) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found or is private',
            ], 404);
        }

        $profile->incrementViews();

        // Log::info('Profile viewed by user', [
        //     'requested_username' => $username,
        //     'profile_username' => $profile->username,
        // ]);

        return response()->json([
            'success' => true,
            'data' => $profile,
        ]);
    }
    
    /**
     * Get current user's profile
     */
    public function show(Request $request)
    {
        $profile = UserProfile::where('user_id', $request->user()->id)->first();
        
        if (!$profile) {
            // Create default profile if doesn't exist
            $profile = UserProfile::create([
                'user_id' => $request->user()->id,
                'username' => $request->user()->name ?? 'user' . $request->user()->id,
                'full_name' => $request->user()->name,
                'email' => $request->user()->email,
                'is_public' => false,
                'show_email' => false,
                'show_phone' => false,
            ]);
        }
        
        return response()->json([
            'success' => true,
            'data' => $profile,
        ]);
    }
    
    /**
     * Update profile
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'sometimes|string|max:255|unique:user_profiles,username,' . $request->user()->id . ',user_id',
            function ($attribute, $value, $fail) {
                if (User::where('email', $value)->exists()) {
                    $fail('This username is not available.');
                }
            },
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
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }
        
        $profile = UserProfile::updateOrCreate(
            ['user_id' => $request->user()->id],
            $validator->validated()
        );
        
        return response()->json([
            'success' => true,
            'data' => $profile,
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
        $user = User::whereHas('profile', function ($query) use ($username) {
            $query->where('username', $username);
        })->firstOrFail();

        $profile = UserProfile::where('user_id', $user->id)->firstOrFail();

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
            'happy_clients' => $user->testimonials()->where('slug', 'happy-client')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
