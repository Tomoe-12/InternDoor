<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('company', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('website')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('company_email')->unique();
            $table->string('password');
            $table->string('industry')->nullable();
            $table->string('organization_size')->nullable();
            $table->string('organization_type')->nullable();
            $table->string('logo')->nullable();
            $table->string('address')->nullable();
            $table->text('description')->nullable();
            $table->string('service_area')->nullable();
            $table->string('operating_hours')->nullable();
            $table->string('linkedin_profile')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company');
    }
};
