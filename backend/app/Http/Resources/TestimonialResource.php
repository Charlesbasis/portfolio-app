<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'client_name' => $this->client_name,
            'client_position' => $this->client_position,
            'client_company' => $this->client_company,
            'client_image' => $this->client_image ? asset('storage/' . $this->client_image) : null,
            'content' => $this->content,
            'rating' => $this->rating,
            'featured' => (bool) $this->featured,
            'order' => $this->order,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
