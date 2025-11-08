<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skills extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'proficiency_level',
        'user_id'
        // 'skill_id',
        // 'years_of_experience',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
