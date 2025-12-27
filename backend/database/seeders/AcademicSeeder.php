<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AcademicSeeder extends Seeder
{
    public function run(): void
    {
        $student = DB::table('students')->orderBy('id')->first();
        if (!$student) return;

        $yearId = DB::table('academic_years')->insertGetId([
            'student_id' => $student->id,
            'year' => 'First Year',
            'year_gpa' => 3.7,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $fallId = DB::table('semesters')->insertGetId([
            'academic_year_id' => $yearId,
            'name' => 'Fall 2024',
            'start_date' => 'Sep 2024',
            'end_date' => 'Dec 2024',
            'gpa' => 3.6,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('subjects')->insert([
            [ 'semester_id' => $fallId, 'name' => 'Introduction to Computer Science', 'code' => 'CS101', 'grade' => 'A-', 'credits' => 4, 'created_at' => now(), 'updated_at' => now() ],
            [ 'semester_id' => $fallId, 'name' => 'Calculus I', 'code' => 'MATH101', 'grade' => 'B+', 'credits' => 4, 'created_at' => now(), 'updated_at' => now() ],
        ]);
    }
}
