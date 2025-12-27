<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // 1) Backfill students from users (preserve IDs for FK continuity)
        if (Schema::hasTable('users') && Schema::hasTable('students')) {
            DB::statement(
                "INSERT INTO students (id, email, password, full_name, profile_image_url, role, verified, created_at, updated_at)
                 SELECT u.id, u.email, u.password, u.full_name, u.profile_image_url, COALESCE(u.role,'STUDENT'), u.verified, u.created_at, u.updated_at
                 FROM users u
                 LEFT JOIN students s ON s.id = u.id
                 WHERE s.id IS NULL"
            );
        }

        // 2) Populate student_id in related tables from existing user_id
        $tables = ['user_connected_accounts','password_reset_tokens','verification_codes','uploaded_files'];
        foreach ($tables as $table) {
            if (Schema::hasTable($table) && Schema::hasColumn($table,'user_id') && Schema::hasColumn($table,'student_id')) {
                // Only set when matching student exists to avoid FK violations
                DB::statement(
                    "UPDATE {$table} 
                     SET student_id = user_id 
                     WHERE student_id IS NULL AND user_id IS NOT NULL 
                     AND EXISTS (SELECT 1 FROM students s WHERE s.id = {$table}.user_id)"
                );
            }
        }

        // 3) Perform true rename: company -> companies
        try { DB::statement('DROP VIEW IF EXISTS companies'); } catch (\Throwable $e) {}
        if (Schema::hasTable('company') && !Schema::hasTable('companies')) {
            DB::statement('ALTER TABLE company RENAME TO companies');
        }
    }

    public function down(): void
    {
        // Best-effort rollback: rename companies back to company if needed
        if (Schema::hasTable('companies') && !Schema::hasTable('company')) {
            DB::statement('ALTER TABLE companies RENAME TO company');
        }
        // Note: data backfill is not reverted.
    }
};
