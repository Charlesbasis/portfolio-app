<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSkill extends Model
{
    protected $table = 'user_skills';

    protected $fillable = [
        'user_id', 
        'skill_id', 
        'proficiency', 
        'years_experience'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }

    /**
     * Scope for user's skills
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for ordering by experience
     */
    public function scopeOrderByExperience($query, $direction = 'desc')
    {
        return $query->orderBy('years_experience', $direction);
    }
}
