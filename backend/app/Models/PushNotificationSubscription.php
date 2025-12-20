<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PushNotificationSubscription extends Model
{
    protected $fillable = ['endpoint','p256dh_key','auth_key'];
}
