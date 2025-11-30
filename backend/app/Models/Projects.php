<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Projects extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'image_url',
        'project_url',
        'github_url',
        'technologies',
        'featured',
        'published',
        'user_id'
    ];

    protected $casts = [
        'technologies' => 'array',
        'featured' => 'boolean',
        'published' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
