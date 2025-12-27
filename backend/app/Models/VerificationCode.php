<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VerificationCode extends Model
{
    protected $fillable = ['user_id','student_id','company_id','code','email_sent','expires_at'];
    protected $casts = ['email_sent' => 'boolean','expires_at' => 'datetime'];

    // Legacy relation
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
