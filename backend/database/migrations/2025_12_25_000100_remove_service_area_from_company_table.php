<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('company') && Schema::hasColumn('company', 'service_area')) {
            Schema::table('company', function (Blueprint $table) {
                $table->dropColumn('service_area');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('company') && !Schema::hasColumn('company', 'service_area')) {
            Schema::table('company', function (Blueprint $table) {
                $table->string('service_area')->nullable();
            });
        }
    }
};
