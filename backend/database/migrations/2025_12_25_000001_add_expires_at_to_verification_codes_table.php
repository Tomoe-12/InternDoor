<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('verification_codes', function (Blueprint $table) {
            // Add expires_at column if it doesn't exist
            if (!Schema::hasColumn('verification_codes', 'expires_at')) {
                $table->dateTime('expires_at')->nullable();
            }
            
            // Add company_id column if it doesn't exist
            if (!Schema::hasColumn('verification_codes', 'company_id')) {
                $table->foreignId('company_id')->nullable()->constrained('company')->cascadeOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('verification_codes', function (Blueprint $table) {
            if (Schema::hasColumn('verification_codes', 'expires_at')) {
                $table->dropColumn('expires_at');
            }
            
            if (Schema::hasColumn('verification_codes', 'company_id')) {
                $table->dropForeignKeyConstraints();
                $table->dropColumn('company_id');
            }
        });
    }
};
