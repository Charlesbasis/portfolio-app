<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class UserSkill extends Pivot
{
    protected $table = 'user_skills';

    protected $fillable = [
        'user_id',
        'skill_id',
        'proficiency',
        'years_experience',
    ];

    protected $casts = [
        'years_experience' => 'integer',
    ];

    /**
     * Get the user that owns the skill.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the skill.
     */
    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }
}
