<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        $tables = ['user_connected_accounts','password_reset_tokens','verification_codes','uploaded_files'];
        foreach ($tables as $table) {
            if (Schema::hasTable($table) && Schema::hasColumn($table, 'user_id')) {
                $driver = DB::getDriverName();
                try {
                    if ($driver === 'sqlite') {
                        DB::statement("ALTER TABLE {$table} DROP COLUMN user_id");
                    } else {
                        Schema::table($table, function (Blueprint $t) {
                            $t->dropColumn('user_id');
                        });
                    }
                } catch (\Throwable $e) {
                    // If dropping fails (older SQLite), fallback to soft cleanup: set to NULL
                    try { DB::statement("UPDATE {$table} SET user_id = NULL"); } catch (\Throwable $e2) {}
                }
            }
        }
    }

    public function down(): void
    {
        // Recreate user_id columns as nullable (best-effort rollback)
        $tables = ['user_connected_accounts','password_reset_tokens','verification_codes','uploaded_files'];
        foreach ($tables as $table) {
            if (Schema::hasTable($table) && !Schema::hasColumn($table, 'user_id')) {
                Schema::table($table, function (Blueprint $t) {
                    $t->unsignedBigInteger('user_id')->nullable();
                });
            }
        }
    }
};
