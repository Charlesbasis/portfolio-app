<?php

namespace App\Repositories;

use App\Models\Skills;
use Illuminate\Database\Eloquent\Builder;
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
        Log::info('SkillRepository: Building query', ['filters' => $filters]);
        
        $query = $this->query()->orderBy('order')->orderBy('name');

        if (!empty($filters['category'])) {
            Log::debug('SkillRepository: Filtering by category', ['category' => $filters['category']]);
            $query->where('category', $filters['category']);
        }

        Log::debug('SkillRepository: Query SQL', [
            'sql' => $query->toSql(),
            'bindings' => $query->getBindings()
        ]);

        return $query;
    }

    public function getGroupedByCategory(): Collection
    {
        Log::info('SkillRepository: Getting grouped skills');
        
        $skills = $this->query()
            ->orderBy('order')
            ->orderBy('name')
            ->get()
            ->groupBy('category');

        Log::info('SkillRepository: Grouped skills', [
            'categories' => $skills->keys()->toArray(),
            'total_skills' => $skills->flatten()->count()
        ]);

        return $skills;
    }
    
}
