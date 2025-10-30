<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'institution',
        'degree',
        'field_of_study',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'grade',
        'location',
        'order',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = ['duration', 'date_range'];

    /**
     * Get the user that owns the education.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get current education.
     */
    public function scopeCurrent($query)
    {
        return $query->where('is_current', true);
    }

    /**
     * Get the duration of the education.
     */
    public function getDurationAttribute()
    {
        $start = Carbon::parse($this->start_date);
        $end = $this->is_current ? Carbon::now() : Carbon::parse($this->end_date);

        $years = $start->diffInYears($end);
        $months = $start->copy()->addYears($years)->diffInMonths($end);

        if ($years > 0 && $months > 0) {
            return "{$years} year" . ($years > 1 ? 's' : '') . " {$months} month" . ($months > 1 ? 's' : '');
        } elseif ($years > 0) {
            return "{$years} year" . ($years > 1 ? 's' : '');
        } else {
            return "{$months} month" . ($months > 1 ? 's' : '');
        }
    }

    /**
     * Get formatted date range.
     */
    public function getDateRangeAttribute()
    {
        $start = Carbon::parse($this->start_date)->format('M Y');
        $end = $this->is_current ? 'Present' : Carbon::parse($this->end_date)->format('M Y');

        return "{$start} - {$end}";
    }
}
