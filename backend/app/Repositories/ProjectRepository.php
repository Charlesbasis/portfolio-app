<?php

namespace App\Repositories;

use App\Models\Projects;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class ProjectRepository
{
    public function query(): Builder
    {
        // Log::info('ProjectRepository: Creating query');
        return Projects::query();
    }

    public function published(): Builder
    {
        // Log::info('ProjectRepository: Filtering published projects');
        return $this->query()->where('status', 'published');
    }

    public function featured(): Builder
    {
        // Log::info('ProjectRepository: Filtering featured projects');
        return $this->published()
            ->where('featured', true)
            ->orderBy('order');
    }

    public function findBySlug(string $slug): ?Projects
    {
        // Log::info('ProjectRepository: Finding project by slug', ['slug' => $slug]);
        return $this->published()
            ->where('slug', $slug)
            ->first();
    }

    public function findBySlugOrFail(string $slug): Projects
    {
        // Log::info('ProjectRepository: Finding project by slug or failing', ['slug' => $slug]);
        return $this->published()
            ->where('slug', $slug)
            ->firstOrFail();
    }

    public function getAll(array $filters = []): Builder
    {
        // Log::info('ProjectRepository: Building query', ['filters' => $filters]);

        $query = $this->published();

        if (!empty($filters['featured'])) {
            $query->where('featured', true);
        }

        if (!empty($filters['technology'])) {
            $query->whereJsonContains('technologies', $filters['technology']);
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->orderBy('order')->orderByDesc('created_at');
    }
}
