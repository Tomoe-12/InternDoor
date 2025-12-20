<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required','email'],
            'password' => ['required']
        ]);

        $user = User::where('email', $validated['email'])->first();
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.']
            ])->status(401);
        }

        $token = JWTAuth::fromUser($user);
        return response()->json(['token' => $token]);
    }

    public function me(Request $request)
    {
        try {
            $bearer = $request->bearerToken();
            if (!$bearer) {
                return response()->json(['error' => 'Unauthorized', 'message' => 'Missing bearer token'], 401);
            }
            $user = JWTAuth::setToken($bearer)->authenticate();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthorized', 'message' => $e->getMessage()], 401);
        }
        return response()->json(new UserResource($user));
    }

    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
        } catch (\Exception $e) {
            // ignore if invalid
        }
        return response()->noContent();
    }

    public function csrf()
    {
        return response()->json(['ok' => true]);
    }
}
