<?php

namespace App\Repositories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class ServiceRepository
{
    public function __construct(
        protected Service $model
    ) {}

    public function query(): Builder
    {
        Log::info('ServiceRepository: Creating query');
        return $this->model->newQuery();
    }

    public function getAll(): Builder
    {
        Log::info('ServiceRepository: Building query');
        return $this->query();
            // ->orderBy('order')
            // ->orderBy('title');
    }

    public function findBySlug(string $slug): ?Service
    {
        Log::info('ServiceRepository: Finding service by slug', ['slug' => $slug]);
        return $this->query()
            ->where('slug', $slug)
            ->first();
    }
}
