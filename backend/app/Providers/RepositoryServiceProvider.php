<?php

namespace App\Providers;

use App\Models\Projects;
use App\Models\Service;
use App\Models\Skills;
use App\Models\Testimonial;
use App\Repositories\ProjectRepository;
use App\Repositories\SkillRepository;
use App\Repositories\TestimonialRepository;
use App\Repositories\ServiceRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(ProjectRepository::class, function ($app) {
            return new ProjectRepository($app->make(Projects::class));
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
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
