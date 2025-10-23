<?php

namespace App\Repositories;

use App\Models\Projects;
use Illuminate\Database\Eloquent\Builder;

class ProjectRepository
{
    public function __construct(
        protected Projects $model
    ) {}

    public function query(): Builder
    {
        return $this->model->newQuery();
    }

    public function published(): Builder
    {
        return $this->query()->where('status', 'published');
    }

    public function featured(): Builder
    {
        return $this->published()
            ->where('featured', true)
            ->orderBy('order');
    }

    public function findBySlug(string $slug): ?Projects
    {
        return $this->published()
            ->where('slug', $slug)
            ->first();
    }

    public function findBySlugOrFail(string $slug): Projects
    {
        return $this->published()
            ->where('slug', $slug)
            ->firstOrFail();
    }

    public function getAll(array $filters = [])
    {
        $query = $this->published();

        if (!empty($filters['featured'])) {
            $query->where('featured', true);
        }

        if (!empty($filters['technology'])) {
            $query->whereJsonContains('technologies', $filters['technology']);
        }

        return $query->orderBy('order')->orderByDesc('created_at');
    }
}
