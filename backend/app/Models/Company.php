<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
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
    ];
}
