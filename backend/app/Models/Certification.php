<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'issuing_organization',
        'issue_date',
        'expiry_date',
        'credential_id',
        'credential_url',
        'description',
        'order',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'order' => 'integer',
    ];

    protected $appends = ['is_expired', 'status'];

    /**
     * Get the user that owns the certification.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if certification is expired.
     */
    public function getIsExpiredAttribute()
    {
        if (!$this->expiry_date) {
            return false;
        }

        return Carbon::parse($this->expiry_date)->isPast();
    }

    /**
     * Get certification status.
     */
    public function getStatusAttribute()
    {
        if (!$this->expiry_date) {
            return 'valid';
        }

        $expiryDate = Carbon::parse($this->expiry_date);
        
        if ($expiryDate->isPast()) {
            return 'expired';
        }
        
        if ($expiryDate->diffInDays(Carbon::now()) <= 30) {
            return 'expiring_soon';
        }

        return 'valid';
    }

    /**
     * Scope for active certifications.
     */
    public function scopeActive($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expiry_date')
              ->orWhere('expiry_date', '>', Carbon::now());
        });
    }
}
