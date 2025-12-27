<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('users')) {
            Schema::drop('users');
        }
    }

    public function down(): void
    {
        // No rollback for users table
    }
};
