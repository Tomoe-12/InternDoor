<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Student extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $table = 'students';

    protected $fillable = [
        'email',
        'password',
        'full_name',
        'name',
        'surname',
        'profile_image_url',
        'role',
        'verified',
        'university',
        'status',
        'overall_gpa',
        'year_of_study',
        'university_start_year',
        'graduation_year',
        'major',
        'minor',
        'remember_token',
        'two_factor_enabled',
    ];

    protected $hidden = ['password','remember_token'];

    protected $casts = [
        'verified' => 'boolean',
        'two_factor_enabled' => 'boolean',
        'overall_gpa' => 'float',
    ];

    public function connectedAccounts()
    {
        return $this->hasMany(UserConnectedAccount::class, 'student_id');
    }

    public function uploadedFiles()
    {
        return $this->hasMany(UploadedFile::class, 'student_id');
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return ['role' => $this->role ?? 'STUDENT'];
    }
}
