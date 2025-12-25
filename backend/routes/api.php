<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\AdminUsersController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\CompaniesController;

// Auth
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('jwt.auth');
    Route::get('/csrf', [AuthController::class, 'csrf']); // placeholder for compatibility
});

// Users
Route::prefix('users')->group(function () {
    Route::post('/', [UsersController::class, 'register']);
    Route::get('/verify-email', [UsersController::class, 'verifyEmail']);
    Route::post('/resend-verification-code', [UsersController::class, 'resendVerificationCode']);
    Route::post('/forgot-password', [UsersController::class, 'forgotPassword']);
    Route::patch('/reset-password', [UsersController::class, 'resetPassword']);

    Route::middleware('jwt.auth')->group(function () {
        Route::put('/{id}', [UsersController::class, 'update']);
        Route::patch('/password', [UsersController::class, 'updatePassword']);
        Route::patch('/{id}/profile-picture', [UsersController::class, 'updateProfilePicture']);
    });
});

// Admin
Route::prefix('admin')->middleware(['jwt.auth', 'can:admin-only'])->group(function () {
    Route::get('/users', [AdminUsersController::class, 'index']);
});

// Notifications
Route::prefix('notifications')->group(function () {
    Route::post('/subscribe', [NotificationsController::class, 'subscribe']);
    Route::post('/denied', [NotificationsController::class, 'denied']);
    Route::post('/notify', [NotificationsController::class, 'notify'])->middleware(['jwt.auth', 'can:admin-only']);
    Route::post('/delivery/{id}', [NotificationsController::class, 'delivery']);
    Route::get('/stats/delivery', [NotificationsController::class, 'deliveryStats'])->middleware(['jwt.auth', 'can:admin-only']);
    Route::get('/stats/subscriptions', [NotificationsController::class, 'subscriptionStats'])->middleware(['jwt.auth', 'can:admin-only']);
});

// Companies
Route::prefix('companies')->group(function () {
    Route::post('/', [CompaniesController::class, 'store']);
});

// Debug: echo headers to verify Authorization is received (temporary)
Route::get('debug/headers', function(\Illuminate\Http\Request $request) {
    return response()->json([
        'authorization' => $request->header('Authorization'),
        'all' => $request->headers->all(),
    ]);
});
