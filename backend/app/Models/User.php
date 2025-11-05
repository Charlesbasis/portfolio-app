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
        'onboarding_completed',
        'onboarding_completed_at',
        'onboarding_data',
        'user_type_id',
    ];

    protected $casts = [
        'onboarding_completed' => 'boolean',
        'onboarding_data' => 'array',
        'onboarding_completed_at' => 'datetime',
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
     * Get the onboarding_completed attribute based on onboarding_completed_at
     */
    public function getOnboardingCompletedAttribute(): bool
    {
        return $this->onboarding_completed_at !== null;
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
        return $this->hasMany(\App\Models\Portfolio\Project::class);
    }

    /**
     * Get the user's skills.
     */
    public function skills()
    {
        return $this->hasMany(Skill::class);
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

    public function completedOnboarding()
    {
        $this->update([
            'onboarding_completed_at' => now(),
            // 'onboarding_completed' => true,
        ]);
    }

    public function getOnboardingStepAttribute($value)
    {
        return $this->onboarding_data['current_step'] ?? [];
    }

    public function userType()
    {
        return $this->belongsTo(UserType::class);
    }

    // Accessor for user type name
    public function getUserTypeNameAttribute()
    {
        return $this->userType->name ?? null;
    }

    public function dynamicFieldValues()
    {
        return $this->hasMany(UserFieldValue::class);
    }
}
