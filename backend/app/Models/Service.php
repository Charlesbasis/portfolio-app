<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache as FacadesCache;
use Illuminate\Support\Str;

class Service extends Model
{
    protected $fillable = [
        'title',
        'description',
        'features',
        'category',
        'user_id',
        'slug', 
    ];

    protected $casts = [
        'features' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($service) {
            // Use user_id directly instead of through relationship
            if ($service->user_id) {
                FacadesCache::forget('dashboard:stats:' . $service->user_id);
            }
            
            if (empty($service->slug)) {
                $service->slug = Str::slug($service->title);
            }
        });

        static::updating(function ($service) {
            // Use user_id directly instead of through relationship
            if ($service->user_id) {
                FacadesCache::forget('dashboard:stats:' . $service->user_id);
            }
        });

        // Add deleting event for completeness
        static::deleting(function ($service) {
            if ($service->user_id) {
                FacadesCache::forget('dashboard:stats:' . $service->user_id);
            }
        });
    }

    public function getUserAttribute()
    {
        if (!$this->relationLoaded('user') && $this->user_id) {
            $this->load('user');
        }

        return $this->getRelationValue('user');
    }
}
