<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\AdminUsersController;
use App\Http\Controllers\NotificationsController;

// Auth
Route::prefix('api/auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:api');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::get('/csrf', [AuthController::class, 'csrf']); // placeholder for compatibility
});

// Users
Route::prefix('api/users')->group(function () {
    Route::post('/', [UsersController::class, 'register']);
    Route::get('/verify-email', [UsersController::class, 'verifyEmail']);
    Route::post('/forgot-password', [UsersController::class, 'forgotPassword']);
    Route::patch('/reset-password', [UsersController::class, 'resetPassword']);

    Route::middleware('auth:api')->group(function () {
        Route::put('/{id}', [UsersController::class, 'update']);
        Route::patch('/password', [UsersController::class, 'updatePassword']);
        Route::patch('/{id}/profile-picture', [UsersController::class, 'updateProfilePicture']);
    });
});

// Admin
Route::prefix('api/admin')->middleware(['auth:api', 'can:admin-only'])->group(function () {
    Route::get('/users', [AdminUsersController::class, 'index']);
});

// Notifications
Route::prefix('api/notifications')->group(function () {
    Route::post('/subscribe', [NotificationsController::class, 'subscribe']);
    Route::post('/denied', [NotificationsController::class, 'denied']);
    Route::post('/notify', [NotificationsController::class, 'notify'])->middleware(['auth:api', 'can:admin-only']);
    Route::post('/delivery/{id}', [NotificationsController::class, 'delivery']);
    Route::get('/stats/delivery', [NotificationsController::class, 'deliveryStats'])->middleware(['auth:api', 'can:admin-only']);
    Route::get('/stats/subscriptions', [NotificationsController::class, 'subscriptionStats'])->middleware(['auth:api', 'can:admin-only']);
});
