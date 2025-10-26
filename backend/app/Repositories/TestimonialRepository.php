<?php

namespace App\Repositories;

use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class TestimonialRepository
{
    public function __construct(
        protected Testimonial $model
    ) {}

    public function query(): Builder
    {
        Log::info('TestimonialRepository: Creating query');
        return $this->model->newQuery();
    }

    public function getAll(): Builder
    {
        Log::info('TestimonialRepository: Building query');
        return $this->query()
            // ->orderBy('order')
            ->orderByDesc('created_at');
    }

    public function getFeatured(): Builder
    {
        Log::info('TestimonialRepository: Filtering featured testimonials');
        return $this->query()
            ->where('featured', true);
            // ->orderBy('order');
    }

}
