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
use App\Http\Middleware\EnsureOnboardingCompleted;
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
    Route::get('/projects/types', [ProjectsController::class, 'getTypes']); // New route
    Route::get('/projects/type/{type}', [ProjectsController::class, 'byType']); // New route
    Route::get('/skills', [SkillsController::class, 'index']);
    Route::post('/contact', [ContactController::class, 'submit']);
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::get('/services', [ServiceController::class, 'index']);
    
    // Public Profile Routes (no auth required)
    Route::prefix('users/{username}')->group(function () {
        Route::get('/profile', [ProfileController::class, 'showPublic']);
        Route::get('/stats', [ProfileController::class, 'publicStats']);
        Route::get('/projects', [ProjectsController::class, 'userProjects']);
        Route::get('/projects/type/{type}', [ProjectsController::class, 'userProjectsByType']); // New route
        Route::get('/skills', [SkillsController::class, 'index']);
        Route::get('/experiences', [ExperienceController::class, 'userExperiences']);
        Route::get('/education', [EducationController::class, 'userEducation']);
        Route::get('/education/roles', [EducationController::class, 'getRoles']); // New route
        Route::get('/education/role/{role}', [EducationController::class, 'userEducationByRole']); // New route
        Route::get('/certifications', [CertificationController::class, 'userCertifications']);
        Route::get('/user-types', [ProfileController::class, 'getUserTypes']);
    });
    
    // Auth routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware(['signed'])
        ->name('verification.verify');

    // Check username availability (public)
    Route::get('/onboarding/check-username/{username}', [OnboardingController::class, 'checkUsername']);
    
    // Protected routes with auth but NOT onboarding completion
    Route::middleware(['auth:sanctum', 'throttle:120,1'])->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);

        // Resend verification email
        Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail'])
            ->middleware(['throttle:6,1'])
            ->name('verification.send');
        
        // Onboarding routes (should NOT require onboarding completion)
        Route::prefix('onboarding')->group(function () {
            Route::get('/user-types', [OnboardingController::class, 'getUserTypes']);
            Route::get('/status', [OnboardingController::class, 'status']);
            Route::post('/complete', [OnboardingController::class, 'complete']);
            Route::post('/step/{step}', [OnboardingController::class, 'getStepConfiguration']);
        });
    });

    // Protected routes that require BOTH auth AND onboarding completion
    Route::middleware(['auth:sanctum', EnsureOnboardingCompleted::class])->group(function () {
        // Current user profile
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);
        Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
        Route::post('/profile/cover-image', [ProfileController::class, 'uploadCoverImage']);
        Route::get('/profile/flexible', [ProfileController::class, 'getProfileWithFlexibleFields']);
        Route::put('/profile/flexible', [ProfileController::class, 'updateFlexibleFields']);
        Route::get('/profile/status-options', [ProfileController::class, 'getCurrentStatusOptions']);
        Route::get('/user-types', [ProfileController::class, 'getUserTypes']);
        
        // Dashboard routes
        Route::prefix('dashboard')->group(function () {
            Route::get('/stats', [DashboardController::class, 'stats']);
            Route::get('/recent-projects', [DashboardController::class, 'recentProjects']);
            Route::get('/recent-messages', [DashboardController::class, 'recentMessages']);
            Route::get('/activity', [DashboardController::class, 'activity']);
            Route::get('/analytics', [DashboardController::class, 'analytics']);
            Route::get('/summary', [DashboardController::class, 'summary']);
        });
        
        // Project type and role management routes
        Route::prefix('projects')->group(function () {
            Route::get('/types', [ProjectsController::class, 'getTypes']);
            Route::get('/type/{type}', [ProjectsController::class, 'byType']);
        });
        
        Route::prefix('education')->group(function () {
            Route::get('/roles', [EducationController::class, 'getRoles']);
            Route::get('/role/{role}', [EducationController::class, 'byRole']);
            Route::get('/student', [EducationController::class, 'asStudent']);
            Route::get('/teacher', [EducationController::class, 'asTeacher']);
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
    });
});
