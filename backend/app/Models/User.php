<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's profile.
     */
    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    /**
     * Get the user's projects.
     */
    public function projects()
    {
        return $this->hasMany(Projects::class);
    }

    /**
     * Get the user's skills.
     */
    public function skills()
    {
        return $this->hasMany(Skills::class);
    }

    /**
     * Get the user's experiences.
     */
    public function experiences()
    {
        return $this->hasMany(Experience::class);
    }

    /**
     * Get the user's education.
     */
    public function education()
    {
        return $this->hasMany(Education::class);
    }

    /**
     * Get the user's certifications.
     */
    public function certifications()
    {
        return $this->hasMany(Certification::class);
    }
}
