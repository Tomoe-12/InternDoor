<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed students and related data
        $this->call(StudentSeeder::class);
        $this->call(SkillsSeeder::class);
        $this->call(AcademicSeeder::class);
    }
}
