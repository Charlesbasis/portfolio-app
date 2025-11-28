<?php

namespace App\Models\Portfolio;

use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory, SoftDeletes, HasSlug;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'description',
        'long_description',
        'image_url',
        'technologies',
        'github_url',
        'live_url',
        'featured',
        'order',
        'status',
        'type',
    ];

    protected $casts = [
        'technologies' => 'array',
        'featured' => 'boolean',
        'order' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    const TYPE_ACADEMIC = 'academic_project';
    const TYPE_PROFESSIONAL = 'professional_project';
    const TYPE_PERSONAL = 'personal_project';
    const TYPE_RESEARCH_PAPER = 'research_paper';
    const TYPE_ASSIGNMENT = 'assignment';

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($project) {
            Cache::forget('dashboard:stats:' . $project->user->id);
            if (empty($project->slug)) {
                $project->slug = Str::slug($project->title);
            }
        });
        static::updating(function ($project) {
            Cache::forget('dashboard:stats:' . $project->user->id);
        });
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function getTypes()
    {
        return [
            self::TYPE_ACADEMIC => 'Academic Project',
            self::TYPE_PROFESSIONAL => 'Professional Project',
            self::TYPE_PERSONAL => 'Personal Project',
            self::TYPE_RESEARCH_PAPER => 'Research Paper',
            self::TYPE_ASSIGNMENT => 'Assignment',
        ];
    }

    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeAcademic($query)
    {
        return $query->ofType(self::TYPE_ACADEMIC);
    }

    public function scopeProfessional($query)
    {
        return $query->ofType(self::TYPE_PROFESSIONAL);
    }

    public function scopePersonal($query)
    {
        return $query->ofType(self::TYPE_PERSONAL);
    }

    public function scopeResearchPaper($query)
    {
        return $query->ofType(self::TYPE_RESEARCH_PAPER);
    }

    public function scopeAssignment($query)
    {
        return $query->ofType(self::TYPE_ASSIGNMENT);
    }
}
