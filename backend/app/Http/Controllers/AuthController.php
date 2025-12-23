<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\Company;
use App\Http\Resources\CompanyResource;
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

        $account = User::where('email', $validated['email'])->first();

        if (!$account) {
            $account = Company::where('company_email', $validated['email'])->first();
        }

        if (!$account || !Hash::check($validated['password'], $account->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.']
            ])->status(401);
        }

        $token = JWTAuth::fromUser($account);
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
        if ($user instanceof Company) {
            return response()->json(new CompanyResource($user));
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
