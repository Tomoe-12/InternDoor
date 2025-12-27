<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserConnectedAccount extends Model
{
    protected $fillable = ['user_id','student_id','company_id','provider','provider_id','connected_at'];
    protected $casts = ['connected_at' => 'datetime'];

    // Backward-compat for legacy code
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
