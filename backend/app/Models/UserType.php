<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'allowed_fields',
        'is_active',
    ];

    protected $casts = [
        'allowed_fields' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the users with this type.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the fields for this user type.
     */
    public function fields()
    {
        return $this->hasMany(UserTypeField::class);
    }

    /**
     * Scope to get only active user types.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
