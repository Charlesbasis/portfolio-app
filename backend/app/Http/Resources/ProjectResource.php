<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'long_description' => $this->long_description,
            'technologies' => $this->technologies,
            'image_url' => $this->image_url ? asset('storage/' . $this->image_url) : null,
            'github_url' => $this->github_url,
            'live_url' => $this->live_url,
            'featured' => (bool) $this->featured,
            'order' => $this->order,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
