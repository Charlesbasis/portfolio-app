<?php

namespace App\Repositories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Builder;

class ServiceRepository
{
    public function __construct(
        protected Service $model
    ) {}

    public function query(): Builder
    {
        return $this->model->newQuery();
    }

    public function getAll(): Builder
    {
        return $this->query()
            ->orderBy('order')
            ->orderBy('title');
    }

    public function findBySlug(string $slug): ?Service
    {
        return $this->query()
            ->where('slug', $slug)
            ->first();
    }
}
