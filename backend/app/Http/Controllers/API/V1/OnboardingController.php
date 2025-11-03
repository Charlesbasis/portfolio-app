<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompleteOnboardingRequest;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class OnboardingController extends Controller
{
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();
        
        return response()->json([
            'completed' => $user->onboarding_completed,
            'current_step' => $user->onboarding_step,
            'profile' => $user->profile,
        ]);
    }

    public function complete(CompleteOnboardingRequest $request): JsonResponse
    {
        $user = $request->user();

        DB::transaction(function () use ($user, $request) {
            // Update user profile with email
            $user->profile()->updateOrCreate(
                ['user_id' => $user->id],
                array_merge(
                    $request->only(['full_name', 'username', 'job_title', 'company', 'location', 'tagline', 'bio']),
                    [
                        'email' => $user->email,
                        'is_public' => true,
                    ]
                )
            );

            // Create project
            if ($request->has('project')) {
                $projectData = $request->input('project');
                $projectData['user_id'] = $user->id;
                $projectData['technologies'] = $projectData['technologies'] ?? [];
                
                // Use the full namespace
                $user->projects()->create($projectData);
            }

            if ($request->has('skills')) {
                $skills = $request->input('skills');
                foreach ($skills as $skillName) {
                    $user->skills()->create([
                        'name' => $skillName,
                        'category' => 'technical', // default category
                        'proficiency' => 80, // default proficiency
                    ]);
                }
            }

            $user->completedOnboarding();
        });

        $user->load(['profile', 'projects', 'skills']);

        return response()->json([
            'message' => 'Onboarding completed successfully',
            'user' => $user
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
}
