<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_type_id',
        'username',
        'full_name',
        'tagline',
        'bio',
        'location',
        'website',
        'avatar_url',
        'cover_image_url',
        'github_url',
        'linkedin_url',
        'twitter_url',
        'email',
        'phone',
        'job_title',
        'company',
        'years_experience',
        'availability_status',
        'profile_views',
        'is_public',
        'show_email',
        'show_phone',
        'custom_fields',
        'headline',
        'current_status',
        'institution',
        'field_of_interest',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'show_email' => 'boolean',
        'show_phone' => 'boolean',
        'profile_views' => 'integer',
        'years_experience' => 'integer',
        'custom_fields' => 'array',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Increment profile views.
     */
    public function incrementViews()
    {
        $this->increment('profile_views');
    }

    /**
     * Get full avatar URL.
     */
    public function getAvatarUrlAttribute($value)
    {
        if (!$value) {
            return null;
        }
        
        // If it's already a full URL, return it
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }
        
        // Otherwise, prepend storage path
        return asset('storage/' . $value);
    }

    /**
     * Get full cover image URL.
     */
    public function getCoverImageUrlAttribute($value)
    {
        if (!$value) {
            return null;
        }
        
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }
        
        return asset('storage/' . $value);
    }

    public function userType()
    {
        return $this->belongsTo(UserType::class);
    }

    public function getDisplayHeadlineAttribute()
    {
        return $this->headline ?? $this->job_title ?? 'No headline set';
    }

    public function getCustomFieldAttribute($key, $default = null)
    {
        return $this->custom_fields[$key] ?? $default;
    }

    public function setCustomField($key, $value)
    {
        $customFields = $this->custom_fields ?? [];
        $customFields[$key] = $value;
        $this->custom_fields = $customFields;
    }
}
