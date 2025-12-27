<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SkillsSeeder extends Seeder
{
    public function run(): void
    {
        $skills = ['JavaScript','Python','React','Node.js','Machine Learning','SQL'];
        foreach ($skills as $name) {
            DB::table('skills')->updateOrInsert(['name' => $name], ['name' => $name, 'created_at' => now(), 'updated_at' => now()]);
        }

        // Attach first student to a couple of skills if present
        $student = DB::table('students')->orderBy('id')->first();
        if ($student) {
            $skillIds = DB::table('skills')->whereIn('name', ['JavaScript','React'])->pluck('id');
            foreach ($skillIds as $sid) {
                DB::table('student_skills')->updateOrInsert([
                    'student_id' => $student->id,
                    'skill_id' => $sid,
                ], [
                    'student_id' => $student->id,
                    'skill_id' => $sid,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
