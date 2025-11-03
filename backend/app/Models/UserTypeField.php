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
        'is_required'
    ];

    // Each field belongs to a user type
    public function userType()
    {
        return $this->belongsTo(UserType::class);
    }
}
