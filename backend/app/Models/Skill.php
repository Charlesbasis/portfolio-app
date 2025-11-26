<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'category',
        'proficiency',
        'icon_url',
        'years_of_experience',
        'order',
        'description',
    ];

    protected $casts = [
        'proficiency' => 'integer',
        'years_of_experience' => 'integer',
        'order' => 'integer',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($skill) {
            if (empty($skill->slug)) {
                $skill->slug = Str::slug($skill->name);

                // Make sure slug is unique
                $originalSlug = $skill->slug;
                $count = 1;
                while (static::where('slug', $skill->slug)->exists()) {
                    $skill->slug = $originalSlug . '-' . $count++;
                }
            }
        });

        static::updating(function ($skill) {
            if ($skill->isDirty('name') && empty($skill->getOriginal('slug'))) {
                $skill->slug = Str::slug($skill->name);

                // Make sure slug is unique
                $originalSlug = $skill->slug;
                $count = 1;
                while (static::where('slug', $skill->slug)->where('id', '!=', $skill->id)->exists()) {
                    $skill->slug = $originalSlug . '-' . $count++;
                }
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function userSkills()
    {
        return $this->hasMany(UserSkill::class);
    }

    public static function getTopSkillsForUser($userId, $limit = 5)
    {
        return static::whereHas('userSkills', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
            ->with(['userSkills' => function ($query) use ($userId) {
                $query->where('user_id', $userId);
            }])
            ->get()
            ->sortByDesc(function ($skill) {
                return $skill->userSkills->first()->years_experience ?? 0;
            })
            ->take($limit)
            ->pluck('name');
    }
}
