<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserType extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description', 'is_active'];

    // A user type has many users
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function fields()
    {
        return $this->hasMany(UserTypeField::class);
    }
}
