<?php

use App\Http\Controllers\API\V1\AuthController;
use App\Http\Controllers\API\V1\ProjectsController;
use App\Http\Controllers\API\V1\SkillsController;
use App\Http\Controllers\API\V1\ContactController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TestimonialController;
use App\Models\Service;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Version 1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    
    // Public routes
    Route::get('/projects', [ProjectsController::class, 'index']);
    Route::get('/projects/{slug}', [ProjectsController::class, 'show']);
    Route::get('/skills', [SkillsController::class, 'index']);
    Route::post('/contact', [ContactController::class, 'submit']);
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::get('services', [ServiceController::class, 'index']);
    
    // Auth routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        
        // Admin project management
        Route::apiResource('admin/projects', ProjectsController::class)
            ->except(['index', 'show']);
        
        // Admin skill management
        Route::apiResource('admin/skills', SkillsController::class)
            ->except(['index']);
    });
});
