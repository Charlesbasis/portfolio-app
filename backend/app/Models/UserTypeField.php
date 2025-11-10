<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'is_active',
        'placeholder',
        'description',
        'options',
        'display_order',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'is_active' => 'boolean',
        'options' => 'array',
        'display_order' => 'integer',
    ];

    public function userType()
    {
        return $this->belongsTo(UserType::class);
    }

    public function values()
    {
        return $this->hasMany(UserFieldValue::class);
    }

    /**
     * Scope to get only active fields.
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
