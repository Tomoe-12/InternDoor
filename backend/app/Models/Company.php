<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Company extends Authenticatable implements JWTSubject
{
    // Migration used singular table name 'company'
    protected $table = 'company';

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
        'service_area',
        'operating_hours',
        'linkedin_profile',
        'verified',
    ];

    protected $casts = [
        'verified' => 'boolean',
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
