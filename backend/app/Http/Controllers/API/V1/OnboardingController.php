<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OnboardingController extends Controller
{
    public function complete(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'username' => 'required|string|max:50|unique:profiles,username|regex:/^[a-z0-9-]+$/',
            'job_title' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'tagline' => 'nullable|string|max:500',
            'bio' => 'nullable|string',
            'first_project' => 'nullable|array',
            'first_project.title' => 'required_with:first_project|string|max:255',
            'first_project.description' => 'required_with:first_project|string',
            'first_project.technologies' => 'nullable|array',
            'skills' => 'nullable|array',
            'skills.*' => 'string|max:100'
        ]);

        DB::beginTransaction();
        
        try {
            // Update or create profile
            $profile = $request->user()->profile()->updateOrCreate(
                ['user_id' => $request->user()->id],
                [
                    'full_name' => $validated['full_name'],
                    'username' => $validated['username'],
                    'job_title' => $validated['job_title'] ?? null,
                    'company' => $validated['company'] ?? null,
                    'location' => $validated['location'] ?? null,
                    'tagline' => $validated['tagline'] ?? null,
                    'bio' => $validated['bio'] ?? null,
                    'is_public' => true,
                ]
            );

            // Create first project if provided
            $project = null;
            if (!empty($validated['first_project'])) {
                $project = $request->user()->projects()->create([
                    'title' => $validated['first_project']['title'],
                    'slug' => Str::slug($validated['first_project']['title']),
                    'description' => $validated['first_project']['description'],
                    'short_description' => Str::limit($validated['first_project']['description'], 200),
                    'technologies' => $validated['first_project']['technologies'] ?? [],
                    'featured' => true,
                    'status' => 'published'
                ]);
            }

            // Add skills if provided
            if (!empty($validated['skills']) && count($validated['skills']) > 0) {
                foreach ($validated['skills'] as $skillName) {
                    $request->user()->skills()->create([
                        'name' => $skillName,
                        'category' => $this->guessSkillCategory($skillName),
                        'proficiency' => 70,
                    ]);
                }
            }

            // Mark onboarding as complete
            $request->user()->update([
                'onboarding_completed' => true,
                'onboarding_completed_at' => now()
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Onboarding completed successfully',
                'profile' => $profile,
                'project' => $project,
                'portfolio_url' => "/portfolio/{$profile->username}"
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete onboarding',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    public function checkUsername($username)
    {
        $exists = DB::table('profiles')
            ->where('username', $username)
            ->exists();

        return response()->json([
            'available' => !$exists,
            'username' => $username
        ]);
    }

    public function status(Request $request)
    {
        $user = $request->user();
        $profile = $user->profile;

        return response()->json([
            'completed' => $user->onboarding_completed ?? false,
            'has_profile' => $profile !== null,
            'has_username' => $profile?->username !== null,
            'has_projects' => $user->projects()->count() > 0,
            'has_skills' => $user->skills()->count() > 0,
        ]);
    }

    private function guessSkillCategory($skillName)
    {
        $categories = [
            'frontend' => ['react', 'vue', 'angular', 'html', 'css', 'tailwind', 'next', 'javascript', 'typescript'],
            'backend' => ['node', 'laravel', 'django', 'php', 'python', 'java', 'express', 'nest'],
            'database' => ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'firebase'],
            'devops' => ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'git'],
            'mobile' => ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android'],
        ];

        $skillLower = strtolower($skillName);
        
        foreach ($categories as $category => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($skillLower, $keyword)) {
                    return $category;
                }
            }
        }

        return 'other';
    }
}
