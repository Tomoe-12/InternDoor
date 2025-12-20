<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VerificationCode extends Model
{
    protected $fillable = ['user_id','code','email_sent'];
    protected $casts = ['email_sent' => 'boolean'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
