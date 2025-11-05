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
        'title',
        'field_of_department',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'grade',
        'location',
        'order',
        'role',
        'position',
        'responsibilities',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = ['duration', 'date_range'];

    const ROLE_STUDENT = 'student';
    const ROLE_TEACHER = 'teacher';

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

    public function getRoles()
    {
        return [
            self::ROLE_STUDENT => 'Student',
            self::ROLE_TEACHER => 'Teacher',
        ];
    }

    public function scopeOfRole($query, $role)
    {
        return $query->where('role', $role);
    }

    public function scopeStudent($query)
    {
        return $query->ofRole(self::ROLE_STUDENT);
    }

    public function scopeTeacher($query)
    {
        return $query->ofRole(self::ROLE_TEACHER);
    }

    public function getDisplayTitleAttribute()
    {
        if ($this->role === self::ROLE_TEACHER) {
            return $this->position ?: 'Teacher';
        }
        return $this->title ?: 'Student';
    }

    public function isStudent()
    {
        return $this->role === self::ROLE_STUDENT;
    }

    public function isTeacher()
    {
        return $this->role === self::ROLE_TEACHER;
    }
}
