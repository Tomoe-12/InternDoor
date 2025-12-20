<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Intentionally left blank to allow custom user and auth-related
        // tables to be created by project-specific migrations under 2025_*.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op: these tables are managed by custom migrations.
    }
};
