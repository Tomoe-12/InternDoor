<?php

namespace Database\Seeders;

use App\Models\VerificationCode;
use Illuminate\Database\Seeder;

class VerificationCodeSeeder extends Seeder
{
    public function run(): void
    {
        // From MySQL dump
        VerificationCode::create([
            'id' => 1,
            'user_id' => 2,
            'code' => '323352',
            'email_sent' => false,
        ]);

        VerificationCode::create([
            'id' => 2,
            'user_id' => 3,
            'code' => '992629',
            'email_sent' => false,
        ]);
    }
}
