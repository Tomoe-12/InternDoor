<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserConnectedAccount extends Model
{
    protected $fillable = ['user_id','provider','provider_id','connected_at'];
    protected $casts = ['connected_at' => 'datetime'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
