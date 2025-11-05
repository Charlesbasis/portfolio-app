<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * UserTypeField Model
 */
class UserTypeField extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_type_id',
        'field_name',
        'field_slug',
        'data_type',
        'validation_rules',
        'is_required',
    ];

    protected $casts = [
        'is_required' => 'boolean',
    ];

    public function userType()
    {
        return $this->belongsTo(UserType::class);
    }

    public function values()
    {
        return $this->hasMany(UserFieldValue::class);
    }
}

/**
 * UserFieldValue Model
 */
class UserFieldValue extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_type_field_id',
        'value',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function field()
    {
        return $this->belongsTo(UserTypeField::class, 'user_type_field_id');
    }

    /**
     * Get the casted value based on field data type.
     */
    public function getCastedValue()
    {
        $dataType = $this->field->data_type ?? 'string';

        return match($dataType) {
            'integer' => (int) $this->value,
            'boolean' => (bool) $this->value,
            'float', 'decimal' => (float) $this->value,
            'json', 'array' => json_decode($this->value, true),
            default => $this->value,
        };
    }
}

/**
 * UserProfile Model
 */
class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
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
    ];

    protected $casts = [
        'years_experience' => 'integer',
        'profile_views' => 'integer',
        'is_public' => 'boolean',
        'show_email' => 'boolean',
        'show_phone' => 'boolean',
    ];

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
}

/**
 * Education Model - Updated to support both student and teacher roles
 */
class Education extends Model
{
    use HasFactory;

    protected $table = 'education';

    protected $fillable = [
        'user_id',
        'role',
        'institution',
        'title', // degree for students, position for teachers
        'field_or_department',
        'position',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'responsibilities',
        'location',
        'gpa',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
        'gpa' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope for student records.
     */
    public function scopeStudent($query)
    {
        return $query->where('role', 'student');
    }

    /**
     * Scope for teacher records.
     */
    public function scopeTeacher($query)
    {
        return $query->where('role', 'teacher');
    }

    /**
     * Scope for current records.
     */
    public function scopeCurrent($query)
    {
        return $query->where('is_current', true);
    }
}
