<?php

namespace App\Repositories;

use App\Models\Projects;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ProjectRepository
{
    /**
     * Get all published projects with filters.
     */
    public function getPublished(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = Projects::query()->published()->orderBy('order')->orderBy('created_at', 'desc');

        if (isset($filters['featured'])) {
            $query->featured();
        }

        if (isset($filters['technology'])) {
            $query->whereJsonContains('technologies', $filters['technology']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage);
    }

    /**
     * Get featured projects.
     */
    public function getFeatured(int $limit = 6): Collection
    {
        return Projects::published()
            ->featured()
            ->orderBy('order')
            ->limit($limit)
            ->get();
    }

    /**
     * Find project by slug.
     */
    public function findBySlug(string $slug): ?Projects
    {
        return Projects::where('slug', $slug)->published()->first();
    }

    /**
     * Create a new project.
     */
    public function create(array $data): Projects
    {
        return Projects::create($data);
    }

    /**
     * Update a project.
     */
    public function update(Projects $project, array $data): bool
    {
        return $project->update($data);
    }

    /**
     * Delete a project.
     */
    public function delete(Projects $project): bool
    {
        return $project->delete();
    }

    /**
     * Get all technologies used across projects.
     */
    public function getAllTechnologies(): array
    {
        return Projects::published()
            ->get()
            ->flatMap(fn($project) => $project->technologies ?? [])
            ->unique()
            ->sort()
            ->values()
            ->toArray();
    }

    /**
     * Get projects by user.
     */
    public function getByUser(int $userId): Collection
    {
        return Projects::where('user_id', $userId)
            ->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
