<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Test email preview route
Route::get('/test-email', function () {
    $user = (object) [
        'full_name' => 'John Doe',
        'email' => 'john@example.com'
    ];
    
    return view('emails.welcome-email', [
        'user' => $user,
        'verificationLink' => 'http://localhost:8000/api/students/verify-email?token=123456',
        'applicationName' => config('app.name')
    ]);
});