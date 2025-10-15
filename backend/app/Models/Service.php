<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'title',
        'description',
        'features',
        'category',
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
}
