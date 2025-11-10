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
        'icon',
        'color',
        'allowed_fields',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'allowed_fields' => 'array',
        'is_active' => 'boolean',
        'display_order' => 'integer',
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
        return $this->hasMany(UserTypeField::class)->orderBy('display_order');
    }

    /**
     * Scope to get only active user types.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by display order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order', 'asc');
    }
}
