<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'full_name' => $this->full_name,
            'tagline' => $this->tagline,
            'bio' => $this->bio,
            'location' => $this->location,
            'website' => $this->website,
            'avatar_url' => $this->avatar_url,
            'cover_image_url' => $this->cover_image_url,
            
            // Social Links
            'github_url' => $this->github_url,
            'linkedin_url' => $this->linkedin_url,
            'twitter_url' => $this->twitter_url,
            
            // Contact (conditional based on privacy settings)
            'email' => $this->when($this->show_email, $this->email),
            'phone' => $this->when($this->show_phone, $this->phone),
            
            // Professional
            'job_title' => $this->job_title,
            'company' => $this->company,
            'years_experience' => $this->years_experience,
            'availability_status' => $this->availability_status,
            
            // Stats
            'profile_views' => $this->profile_views,
            
            // Settings (only for owner)
            'is_public' => $this->when($request->user()?->id === $this->user_id, $this->is_public),
            'show_email' => $this->when($request->user()?->id === $this->user_id, $this->show_email),
            'show_phone' => $this->when($request->user()?->id === $this->user_id, $this->show_phone),
            
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
