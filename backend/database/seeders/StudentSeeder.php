<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        Student::updateOrCreate(
            ['email' => 'student.admin@example.com'],
            [
                'full_name' => 'Admin Student',
                'password' => Hash::make('Password123'),
                'role' => 'ADMIN',
                'verified' => true,
                'status' => 'Active',
                'university' => 'MIT',
                'year_of_study' => 'Junior',
            ]
        );

        Student::updateOrCreate(
            ['email' => 'student.user@example.com'],
            [
                'full_name' => 'Demo Student',
                'password' => Hash::make('Password123'),
                'role' => 'STUDENT',
                'verified' => true,
                'status' => 'Active',
                'university' => 'MIT',
                'year_of_study' => 'Sophomore',
            ]
        );
    }
}
