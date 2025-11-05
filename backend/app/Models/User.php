<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'user_type_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the user type associated with the user.
     */
    public function userType()
    {
        return $this->belongsTo(UserType::class);
    }

    /**
     * Get the user's profile.
     */
    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    /**
     * Get the user's skills.
     */
    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'user_skills')
                    ->withPivot('proficiency', 'years_experience')
                    ->withTimestamps();
    }

    /**
     * Get the user's projects.
     */
    public function projects()
    {
        return $this->hasMany(Projects::class);
    }

    /**
     * Get the user's experiences.
     */
    public function experiences()
    {
        return $this->hasMany(Experience::class);
    }

    /**
     * Get the user's education records.
     */
    public function education()
    {
        return $this->hasMany(Education::class);
    }

    /**
     * Get the user's testimonials.
     */
    public function testimonials()
    {
        return $this->hasMany(Testimonial::class);
    }

    /**
     * Get the user's services.
     */
    public function services()
    {
        return $this->hasMany(Service::class);
    }

    /**
     * Get the user's field values.
     */
    public function fieldValues()
    {
        return $this->hasMany(UserFieldValue::class);
    }

    /**
     * Check if user is a student.
     */
    public function isStudent()
    {
        return $this->userType?->slug === 'student';
    }

    /**
     * Check if user is a teacher.
     */
    public function isTeacher()
    {
        return $this->userType?->slug === 'teacher';
    }

    /**
     * Check if user is a professional.
     */
    public function isProfessional()
    {
        return $this->userType?->slug === 'professional';
    }

    /**
     * Check if user is a freelancer.
     */
    public function isFreelancer()
    {
        return $this->userType?->slug === 'freelancer';
    }
}
