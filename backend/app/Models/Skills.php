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
        'proficiency',
        'years_of_experience',
        'user_id',
        'slug',
        'icon_url',
        'order'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
