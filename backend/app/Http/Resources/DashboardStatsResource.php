<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardStatsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return array_merge(
            $this->resource,
            [
                'meta' => [
                    'user_type' => $request->user()->userType?->slug ?? 'professional',
                    'cached_at' => now()->toISOString(),
                    'cache_ttl' => 600, // 10 minutes
                ]
            ]
        );
    }
}
