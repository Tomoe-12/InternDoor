<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Student;
use App\Models\Company;
use App\Models\VerificationCode;
use App\Http\Resources\CompanyResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Traits\GeneratesSecureCode;

class AuthController extends Controller
{
    use GeneratesSecureCode;
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required','email'],
            'password' => ['required']
        ]);

        $account = Student::where('email', $validated['email'])->first();

        if (!$account) {
            $account = Company::where('company_email', $validated['email'])->first();
        }

        if (!$account || !Hash::check($validated['password'], $account->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.']
            ])->status(401);
        }

        // Check if account is verified
        if (!$account->verified) {
            $idColumn = $account instanceof Company ? 'company_id' : 'student_id';
            $latestCode = VerificationCode::where($idColumn, $account->id)
                ->orderBy('created_at', 'desc')
                ->first();

            if ($latestCode && $latestCode->expires_at && $latestCode->expires_at > now()) {
                // Token NOT expired: block login and instruct verification
                return response()->json([
                    'message' => 'Verify your email',
                    'reason' => 'verification_pending',
                    'verificationLink' => config('app.url').'/api/students/verify-email?token='.$latestCode->code,
                    'expiresAt' => $latestCode->expires_at,
                ], 403);
            }

            // Token expired or missing: delete old codes, issue new, send email, and block login
            VerificationCode::where($idColumn, $account->id)->delete();

            $newCodeStr = $this->generateSecureCode();
            $newCode = VerificationCode::create([
                $idColumn => $account->id,
                'code' => $newCodeStr,
                'email_sent' => false,
                'expires_at' => now()->addHours(1),
            ]);

            if ($account instanceof Company) {
                Mail::send('emails.welcome-email', [
                    'company' => $account,
                    'verificationLink' => config('app.url').'/api/students/verify-email?token='.$newCode->code,
                    'applicationName' => config('app.name'),
                    'expiresAt' => $newCode->expires_at,
                ], function($m) use ($account) {
                    $m->to($account->company_email)->subject('Verify your email address');
                });
            } else {
                Mail::send('emails.welcome-email', [
                    'user' => $account,
                    'verificationLink' => config('app.url').'/api/students/verify-email?token='.$newCode->code,
                    'applicationName' => config('app.name'),
                    'expiresAt' => $newCode->expires_at,
                ], function($m) use ($account) {
                    $m->to($account->email)->subject('Verify your email address');
                });
            }

            $newCode->email_sent = true; $newCode->save();

            return response()->json([
                'message' => 'Verify your email',
                'reason' => 'verification_sent',
            ], 403);
        }

        $token = JWTAuth::fromUser($account);
        
        // Return student/company data along with token
        if ($account instanceof Company) {
            return response()->json([
                'token' => $token,
                'user' => new CompanyResource($account)
            ]);
        }
        
        return response()->json([
            'token' => $token,
            'user' => new UserResource($account)
        ]);
    }

    public function me(Request $request)
    {
        try {
            $bearer = $request->bearerToken();
            if (!$bearer) {
                return response()->json(['error' => 'Unauthorized', 'message' => 'Missing bearer token'], 401);
            }

            // Inspect token payload to decide whether it belongs to a Company or a User
            $payload = JWTAuth::setToken($bearer)->getPayload();
            $subjectId = $payload->get('sub');
            $type = $payload->get('type');

            if ($type === 'company') {
                $company = Company::find($subjectId);
                if (!$company) {
                    return response()->json(['error' => 'Unauthorized', 'message' => 'Company not found'], 401);
                }
                return response()->json(new CompanyResource($company));
            }

            // Default: authenticate as Student
            $user = JWTAuth::setToken($bearer)->authenticate();
            return response()->json(new UserResource($user));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthorized', 'message' => $e->getMessage()], 401);
        }
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
