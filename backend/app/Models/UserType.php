<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserType extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description', 'allowed_fields', 'is_active'];

    protected $casts = [
        'allowed_fields' => 'array',
        'is_active' => 'boolean',
    ];

    // A user type has many users
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function fields()
    {
        return $this->hasMany(UserTypeField::class);
    }

    public function userProfiles()
    {
        return $this->hasMany(UserProfile::class);
    }
}
