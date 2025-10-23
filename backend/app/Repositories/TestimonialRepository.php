<?php

namespace App\Repositories;

use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Builder;

class TestimonialRepository
{
    public function __construct(
        protected Testimonial $model
    ) {}

    public function query(): Builder
    {
        return $this->model->newQuery();
    }

    public function getAll(): Builder
    {
        return $this->query()
            ->orderBy('order')
            ->orderByDesc('created_at');
    }

    public function getFeatured(): Builder
    {
        return $this->query()
            ->where('featured', true)
            ->orderBy('order');
    }

}
