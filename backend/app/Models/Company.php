<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Company extends Authenticatable implements JWTSubject
{
    // Use pluralized table after rename
    protected $table = 'companies';

    protected $fillable = [
        'company_name',
        'website',
        'phone_number',
        'company_email',
        'password',
        'industry',
        'organization_size',
        'organization_type',
        'logo',
        'address',
        'description',
        'operating_hours',
        'linkedin_profile',
        'profile_complete',
        'verified',
    ];

    protected $casts = [
        'profile_complete' => 'boolean',
        'verified' => 'boolean',
        'operating_hours' => 'array',
    ];

    protected $hidden = ['password'];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return ['type' => 'company'];
    }
}
