<?php

namespace App\Services;

use App\Models\Projects;
use App\Repositories\ProjectRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class ProjectService
{
    protected ProjectRepository $projectRepository;

    /**
     * Get all published projects with caching.
     */
    public function getPublishedProjects(array $filters = [], int $perPage = 12)
    {
        $cacheKey = 'projects:published:' . md5(json_encode($filters)) . ':page:' . request('page', 1);

        return Cache::remember($cacheKey, 3600, function () use ($filters, $perPage) {
            return $this->projectRepository->getPublished($filters, $perPage);
        });
    }

    /**
     * Get featured projects.
     */
    public function getFeaturedProjects(int $limit = 6)
    {
        return Cache::remember('projects:featured', 3600, function () use ($limit) {
            return $this->projectRepository->getFeatured($limit);
        });
    }

    /**
     * Get project by slug.
     */
    public function getProjectBySlug(string $slug)
    {
        return Cache::remember("project:slug:{$slug}", 3600, function () use ($slug) {
            return $this->projectRepository->findBySlug($slug);
        });
    }

    /**
     * Create a new project.
     */
    public function createProject(array $data, ?UploadedFile $image = null)
    {
        if ($image) {
            $data['image_url'] = $this->uploadImage($image);
        }

        $project = $this->projectRepository->create($data);

        // Clear cache
        $this->clearProjectCache();

        return $project;
    }

    /**
     * Update a project.
     */
    public function updateProject(Projects $project, array $data, ?UploadedFile $image = null)
    {
        if ($image) {
            // Delete old image
            if ($project->image_url) {
                $this->deleteImage($project->image_url);
            }

            $data['image_url'] = $this->uploadImage($image);
        }

        $updated = $this->projectRepository->update($project, $data);

        // Clear cache
        $this->clearProjectCache();

        return $updated;
    }

    /**
     * Delete a project.
     */
    public function deleteProject(Projects $project)
    {
        // Delete image
        if ($project->image_url) {
            $this->deleteImage($project->image_url);
        }

        $deleted = $this->projectRepository->delete($project);

        // Clear cache
        $this->clearProjectCache();

        return $deleted;
    }

    /**
     * Upload project image.
     */
    protected function uploadImage(UploadedFile $image): string
    {
        $path = $image->store('projects', 'public');
        return Storage::url($path);
    }

    /**
     * Delete project image.
     */
    protected function deleteImage(string $imageUrl): void
    {
        $path = str_replace('/storage/', '', $imageUrl);
        Storage::disk('public')->delete($path);
    }

    /**
     * Clear all project caches.
     */
    protected function clearProjectCache(): void
    {
        Cache::tags(['projects'])->flush();
    }

    /**
     * Get project statistics.
     */
    public function getStatistics()
    {
        return Cache::remember('projects:statistics', 3600, function () {
            return [
                'total' => Projects::count(),
                'published' => Projects::published()->count(),
                'featured' => Projects::featured()->count(),
                'draft' => Projects::where('status', 'draft')->count(),
                'by_technology' => Projects::published()
                    ->get()
                    ->flatMap(fn($p) => $p->technologies ?? [])
                    ->countBy()
                    ->sortDesc()
                    ->take(10),
            ];
        });
    }
}
