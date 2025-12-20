<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UploadedFile extends Model
{
    protected $fillable = ['user_id','url','size','original_file_name','extension','uploaded_at'];
    protected $casts = ['uploaded_at' => 'datetime'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
