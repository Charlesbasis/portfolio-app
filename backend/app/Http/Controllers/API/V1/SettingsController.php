<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SettingsController extends Controller
{
    /**
     * Get all user settings
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $profile = UserProfile::where('user_id', $user->id)->first();
        
        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'profile' => $profile,
                'stats' => [
                    'projects' => $user->projects()->count(),
                    'skills' => $user->skills()->count(),
                    'experiences' => $user->experiences()->count(),
                    'education' => $user->education()->count(),
                    'certifications' => $user->certifications()->count(),
                ],
            ],
        ]);
    }

    /**
     * Update account settings
     */
    public function updateAccount(Request $request)
    {
        $user = $request->user();
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Account updated successfully',
            'data' => $user,
        ]);
    }

    /**
     * Update password
     */
    public function updatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect',
            ], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully',
        ]);
    }

    /**
     * Update privacy settings
     */
    public function updatePrivacy(Request $request)
    {
        $validator = Validator::make($request->all(), [
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

        $profile = UserProfile::where('user_id', $request->user()->id)->firstOrFail();
        $profile->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Privacy settings updated successfully',
            'data' => $profile,
        ]);
    }

    /**
     * Delete avatar
     */
    public function deleteAvatar(Request $request)
    {
        $profile = UserProfile::where('user_id', $request->user()->id)->firstOrFail();
        
        if ($profile->avatar_url && !filter_var($profile->avatar_url, FILTER_VALIDATE_URL)) {
            Storage::disk('public')->delete($profile->avatar_url);
        }
        
        $profile->avatar_url = null;
        $profile->save();

        return response()->json([
            'success' => true,
            'message' => 'Avatar deleted successfully',
        ]);
    }

    /**
     * Delete cover image
     */
    public function deleteCoverImage(Request $request)
    {
        $profile = UserProfile::where('user_id', $request->user()->id)->firstOrFail();
        
        if ($profile->cover_image_url && !filter_var($profile->cover_image_url, FILTER_VALIDATE_URL)) {
            Storage::disk('public')->delete($profile->cover_image_url);
        }
        
        $profile->cover_image_url = null;
        $profile->save();

        return response()->json([
            'success' => true,
            'message' => 'Cover image deleted successfully',
        ]);
    }

    /**
     * Delete account
     */
    public function deleteAccount(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
            'confirmation' => 'required|in:DELETE',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Password is incorrect',
            ], 422);
        }

        // Delete user (cascade will handle related records)
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Account deleted successfully',
        ]);
    }

    /**
     * Get activity log
     */
    public function activityLog(Request $request)
    {
        $user = $request->user();
        
        $activities = collect([]);
        
        // Recent projects
        $user->projects()->latest()->take(5)->get()->each(function ($project) use ($activities) {
            $activities->push([
                'type' => 'project',
                'action' => 'created',
                'title' => $project->title,
                'timestamp' => $project->created_at,
            ]);
        });
        
        // Recent experiences
        $user->experiences()->latest()->take(5)->get()->each(function ($exp) use ($activities) {
            $activities->push([
                'type' => 'experience',
                'action' => 'added',
                'title' => "{$exp->position} at {$exp->company}",
                'timestamp' => $exp->created_at,
            ]);
        });

        return response()->json([
            'success' => true,
            'data' => $activities->sortByDesc('timestamp')->values(),
        ]);
    }
}
