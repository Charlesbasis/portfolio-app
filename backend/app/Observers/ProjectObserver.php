<?php

namespace App\Observers;

use App\Models\Projects;
use Illuminate\Support\Str;

class ProjectObserver
{
    public function creating(Projects $project)
    {
        if (empty($project->slug)) {
            $project->slug = $this->generateUniqueSlug($project->title);
        }
    }

    public function updating(Projects $project)
    {
        if ($project->isDirty('title') && empty($project->slug)) {
            $project->slug = $this->generateUniqueSlug($project->title);
        }
    }

    private function generateUniqueSlug($title)
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $counter = 1;

        while (Projects::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
