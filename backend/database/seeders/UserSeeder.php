<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // From MySQL dump
        User::create([
            'id' => 1,
            'email' => 'admin@email.com',
            'full_name' => null,
            'password' => '$2a$10$RlHBr2bevYun.VUB0AQ/AezrOZGqPLaXnPV29V3R8nBRmm9YQ2p6O',
            'profile_image_url' => null,
            'role' => 'ADMIN',
            'verified' => false,
        ]);

        User::create([
            'id' => 2,
            'email' => 'li8993han@gmail.com',
            'full_name' => 'Khun Thi Han',
            'password' => '$2a$10$SdKCWAdhmDYwvUF4WOadd.G2ScJ1nvH8Wf/67C4wzBMEI68XyWzVq',
            'profile_image_url' => null,
            'role' => 'USER',
            'verified' => false,
        ]);

        User::create([
            'id' => 3,
            'email' => 'khunthihan.official@gmail.com',
            'full_name' => 'Khun Thi Han',
            'password' => '$2a$10$A6EquuHHAOuqGavkrWkKietJriDCSHAUO4QmaO6WjuQ30u/XVvWiu',
            'profile_image_url' => null,
            'role' => 'USER',
            'verified' => false,
        ]);
    }
}
