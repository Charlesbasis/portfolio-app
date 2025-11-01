<?php

use App\Http\Controllers\API\V1\AuthController;
use App\Http\Controllers\API\V1\CertificationController;
use App\Http\Controllers\API\V1\ProjectsController;
use App\Http\Controllers\API\V1\SkillsController;
use App\Http\Controllers\API\V1\ContactController;
use App\Http\Controllers\API\V1\DashboardController;
use App\Http\Controllers\API\V1\EducationController;
use App\Http\Controllers\API\V1\ExperienceController;
use App\Http\Controllers\API\V1\OnboardingController;
use App\Http\Controllers\API\V1\ProfileController;
use App\Http\Controllers\API\V1\ServiceController;
use App\Http\Controllers\API\V1\SettingsController;
use App\Http\Controllers\API\V1\TestimonialController;
use Illuminate\Http\Request;
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
    Route::get('/services', [ServiceController::class, 'index']);
    
    // Public Profile Routes (no auth required)
    Route::prefix('users/{username}')->group(function () {
        Route::get('/profile', [ProfileController::class, 'showPublic']);
        Route::get('/stats', [ProfileController::class, 'publicStats']);
        Route::get('/projects', [ProjectsController::class, 'userProjects']);
        Route::get('/skills', [SkillsController::class, 'index']);
        Route::get('/experiences', [ExperienceController::class, 'userExperiences']);
        Route::get('/education', [EducationController::class, 'userEducation']);
        Route::get('/certifications', [CertificationController::class, 'userCertifications']);
    });
    
    // Auth routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware(['signed'])
        ->name('verification.verify');
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);

        // Resend verification email
        Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail'])
            ->middleware(['throttle:6,1'])
            ->name('verification.send');
        
        // Current user profile
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);
        Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
        Route::post('/profile/cover-image', [ProfileController::class, 'uploadCoverImage']);
        
        // Dashboard routes
        Route::prefix('dashboard')->group(function () {
            Route::get('/stats', [DashboardController::class, 'stats']);
            Route::get('/recent-projects', [DashboardController::class, 'recentProjects']);
            Route::get('/recent-messages', [DashboardController::class, 'recentMessages']);
            Route::get('/activity', [DashboardController::class, 'activity']);
            Route::get('/analytics', [DashboardController::class, 'analytics']);
            Route::get('/summary', [DashboardController::class, 'summary']);
        });
        
        // Admin project management
        Route::apiResource('admin/projects', ProjectsController::class)
            ->except(['index', 'show']);
        
        // Admin skill management
        Route::apiResource('admin/skills', SkillsController::class)
            ->except(['index']);

        // Experiences
        Route::apiResource('experiences', ExperienceController::class);
        
        // Education
        Route::apiResource('education', EducationController::class);
        
        // Certifications
        Route::apiResource('certifications', CertificationController::class);
        
        // Admin Contact management
        Route::prefix('admin')->group(function () {
            Route::get('/contacts', [ContactController::class, 'index']);
            Route::put('/contacts/{contact}', [ContactController::class, 'update']);
            Route::delete('/contacts/{contact}', [ContactController::class, 'destroy']);
        });
        
        // Admin Service management
        Route::apiResource('admin/services', ServiceController::class)
            ->except(['index', 'show']);
        
        // Admin Testimonial management
        Route::apiResource('admin/testimonials', TestimonialController::class)
            ->except(['index']);

        // Settings routes
        Route::prefix('settings')->group(function () {
            Route::get('/', [SettingsController::class, 'index']);
            Route::put('/account', [SettingsController::class, 'updateAccount']);
            Route::put('/password', [SettingsController::class, 'updatePassword']);
            Route::put('/privacy', [SettingsController::class, 'updatePrivacy']);
            Route::delete('/avatar', [SettingsController::class, 'deleteAvatar']);
            Route::delete('/cover-image', [SettingsController::class, 'deleteCoverImage']);
            Route::delete('/account', [SettingsController::class, 'deleteAccount']);
            Route::get('/activity', [SettingsController::class, 'activityLog']);
        });

        Route::prefix('onboarding')->group(function () {
            Route::post('/complete', [OnboardingController::class, 'complete']);
            Route::get('/check-username/{username}', [OnboardingController::class, 'checkUsername']);
            Route::get('/status', [OnboardingController::class, 'status']);
        });

    });
});
