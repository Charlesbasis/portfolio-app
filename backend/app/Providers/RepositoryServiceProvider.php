<?php

namespace App\Providers;

use App\Models\Portfolio\Project;
use App\Models\Service;
use App\Models\Skills;
use App\Models\Testimonial;
use App\Repositories\ProjectRepository;
use App\Repositories\SkillRepository;
use App\Repositories\TestimonialRepository;
use App\Repositories\ServiceRepository;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        try {
            $this->app->bind(ProjectRepository::class, function ($app) {
                return new ProjectRepository($app->make(Project::class));
            });

            $this->app->bind(SkillRepository::class, function ($app) {
                return new SkillRepository($app->make(Skills::class));
            });

            $this->app->bind(TestimonialRepository::class, function ($app) {
                return new TestimonialRepository($app->make(Testimonial::class));
            });

            $this->app->bind(ServiceRepository::class, function ($app) {
                return new ServiceRepository($app->make(Service::class));
            });
        } catch (\Exception $e) {
            Log::warning('Repository binding failed: ' . $e->getMessage());
        }
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
