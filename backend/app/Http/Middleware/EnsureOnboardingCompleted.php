<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOnboardingCompleted
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && !$user->onboarding_completed) {
        // if ($user && !$user->onboarding_completed_at) {
            return response()->json([
                'success' => false,
                'message' => 'Please complete onboarding first',
                'redirect' => '/onboarding'
            ], 403);
        }

        return $next($request);
    }
}
