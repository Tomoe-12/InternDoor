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
        Schema::table('company', function (Blueprint $table) {
            // Add profile fields only if they are missing (safe for re-run)
            $columns = [
                'website' => fn() => $table->string('website')->nullable(),
                'industry' => fn() => $table->string('industry')->nullable(),
                'organization_size' => fn() => $table->string('organization_size')->nullable(),
                'description' => fn() => $table->text('description')->nullable(),
                'address' => fn() => $table->string('address')->nullable(),
            ];

            foreach ($columns as $name => $callback) {
                if (!Schema::hasColumn('company', $name)) {
                    $callback();
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('company', function (Blueprint $table) {
            $columns = [
                'website',
                'industry',
                'organization_size',
                'description',
                'address',
            ];

            foreach ($columns as $name) {
                if (Schema::hasColumn('company', $name)) {
                    $table->dropColumn($name);
                }
            }
        });
    }
};
