<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardStatsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'projects' => [
                'total' => $this->resource['projects']['total'] ?? 0,
                'published' => $this->resource['projects']['published'] ?? 0,
                'draft' => $this->resource['projects']['draft'] ?? 0,
                'featured' => $this->resource['projects']['featured'] ?? 0,
                'growth' => $this->calculateGrowth('projects'),
            ],
            'skills' => [
                'total' => $this->resource['skills']['total'] ?? 0,
                'by_category' => $this->resource['skills']['by_category'] ?? [],
            ],
            'messages' => [
                'total' => $this->resource['messages']['total'] ?? 0,
                'unread' => $this->resource['messages']['unread'] ?? 0,
                'read' => $this->resource['messages']['read'] ?? 0,
                'replied' => $this->resource['messages']['replied'] ?? 0,
                'response_rate' => $this->calculateResponseRate(),
            ],
            'experiences' => [
                'total' => $this->resource['experiences']['total'] ?? 0,
                'current' => $this->resource['experiences']['current'] ?? 0,
            ],
            'testimonials' => [
                'total' => $this->resource['testimonials']['total'] ?? 0,
                'featured' => $this->resource['testimonials']['featured'] ?? 0,
            ],
            'services' => [
                'total' => $this->resource['services']['total'] ?? 0,
            ],
        ];
    }

    private function calculateGrowth(string $type): float
    {
        // This is a placeholder. You can implement actual growth calculation
        // by comparing current month vs previous month data
        return 0.0;
    }

    private function calculateResponseRate(): float
    {
        $total = $this->resource['messages']['total'] ?? 0;
        if ($total === 0) {
            return 0;
        }

        $replied = $this->resource['messages']['replied'] ?? 0;
        return round(($replied / $total) * 100, 2);
    }
}
