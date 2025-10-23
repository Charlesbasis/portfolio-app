<?php

namespace App\Repositories;

use App\Models\Skills;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class SkillRepository
{
    public function __construct(
        protected Skills $model
    ) {}

    public function query(): Builder
    {
        return $this->model->newQuery();
    }

    public function getAll(array $filters = []): Builder
    {
        $query = $this->query()->orderBy('order')->orderBy('name');

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        return $query;
    }

    public function getGroupedByCategory(): Collection
    {
        return $this->query()
            ->orderBy('order')
            ->orderBy('name')
            ->get()
            ->groupBy('category');
    }

    \Illuminate\Support\Facades\Log::info('test');
}
