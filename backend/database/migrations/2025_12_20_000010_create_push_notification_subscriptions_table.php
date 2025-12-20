<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('push_notification_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->text('endpoint')->nullable();
            $table->string('auth_key')->nullable();
            $table->string('p256dh_key')->nullable();
            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('push_notification_subscriptions');
    }
};
