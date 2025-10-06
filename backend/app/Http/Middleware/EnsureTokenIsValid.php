<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenIsValid
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the token is present
        if (!$request->bearerToken()) {
            return response()->json([
                'success' => false,
                'message' => 'Token not provided',
            ], 401);
        }

        // Check if the token is valid
        if (!auth('sanctum')->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        // Optional: Check token abilities/scopes
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 401);
        }

        // Log token usage for security auditing
        Log::info('API Token used', [
            'user_id' => $user->id,
            'email' => $user->email,
            'ip' => $request->ip(),
            'endpoint' => $request->path(),
        ]);

        return $next($request);
    }
}
