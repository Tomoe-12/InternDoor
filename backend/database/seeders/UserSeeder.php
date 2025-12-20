<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure admin exists and set a known password for development
        User::updateOrCreate(
            ['email' => 'admin@email.com'],
            [
                'full_name' => null,
                // Default dev password: Password123
                'password' => Hash::make('Password123'),
                'profile_image_url' => null,
                'role' => 'ADMIN',
                'verified' => false,
            ]
        );

        User::updateOrCreate(
            ['email' => 'li8993han@gmail.com'],
            [
                'full_name' => 'Khun Thi Han',
                // Set a known dev password hashed with Laravel's bcrypt
                'password' => Hash::make('Password123'),
                'profile_image_url' => null,
                'role' => 'USER',
                'verified' => false,
            ]
        );

        User::updateOrCreate(
            ['email' => 'khunthihan.official@gmail.com'],
            [
                'full_name' => 'Khun Thi Han',
                // Set a known dev password hashed with Laravel's bcrypt
                'password' => Hash::make('Password123'),
                'profile_image_url' => null,
                'role' => 'USER',
                'verified' => false,
            ]
        );
    }
}
