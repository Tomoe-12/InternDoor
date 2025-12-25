<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use App\Models\VerificationCode;
use App\Traits\GeneratesSecureCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class CompaniesController extends Controller
{
    use GeneratesSecureCode;
    /**
     * Store a newly created company.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'phone_number' => ['required', 'string', 'max:50'],
            'company_email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        // Cross-table uniqueness: prevent using same email in users table
        $userEmailExists = User::where('email', $validated['company_email'])->exists();
        if ($userEmailExists) {
            return response()->json([
                'message' => 'Email is already used by a user account',
                'reason' => 'email_in_use_by_user'
            ], 400);
        }

        // Check if email already exists
        $existingCompany = Company::where('company_email', $validated['company_email'])->first();
        if ($existingCompany) {
            if ($existingCompany->verified) {
                // Email exists and IS verified
                return response()->json([
                    'message' => 'Account already exists',
                    'reason' => 'email_already_verified'
                ], 400);
            } else {
                // Email exists but NOT verified
                $latestCode = VerificationCode::where('company_id', $existingCompany->id)
                    ->orderBy('created_at', 'desc')
                    ->first();

                if ($latestCode && $latestCode->expires_at && $latestCode->expires_at > now()) {
                    // Token NOT expired: reject and instruct to verify
                    return response()->json([
                        'message' => 'Account already exists. Verify your email first.',
                        'reason' => 'verification_pending',
                        'verificationLink' => config('app.url').'/api/users/verify-email?token='.$latestCode->code,
                        'expiresAt' => $latestCode->expires_at,
                        'email' => $existingCompany->company_email,
                    ], 400);
                }

                // Token expired or missing: delete old, issue new, send email, then reject
                VerificationCode::where('company_id', $existingCompany->id)->delete();

                $newCodeStr = $this->generateSecureCode();
                $newCode = VerificationCode::create([
                    'company_id' => $existingCompany->id,
                    'code' => $newCodeStr,
                    'email_sent' => false,
                    'expires_at' => now()->addHours(1),
                ]);

                Mail::raw(
                    'Welcome! Please verify your company account by visiting: '.config('app.url').'/api/users/verify-email?token='.$newCode->code."\n\nThis link will expire in 1 hour.",
                    function ($m) use ($existingCompany) {
                        $m->to($existingCompany->company_email)->subject('Verify your company account');
                    }
                );
                $newCode->email_sent = true; $newCode->save();

                return response()->json([
                    'message' => 'Account already exists. Verify your email first.',
                    'reason' => 'verification_sent',
                    'email' => $existingCompany->company_email,
                ], 400);
            }
        }

        $company = new Company();
        $company->company_name = $validated['company_name'];
        $company->website = $validated['website'] ?? null;
        $company->phone_number = $validated['phone_number'];
        $company->company_email = $validated['company_email'];
        $company->password = Hash::make($validated['password']);
        $company->verified = false;
        $company->save();

        $verificationCode = $this->generateSecureCode();
        $code = VerificationCode::create([
            'company_id' => $company->id,
            'code' => $verificationCode,
            'email_sent' => false,
            'expires_at' => now()->addHours(1),
        ]);

        Mail::send('emails.welcome-email', [
            'company' => $company,
            'verificationLink' => config('app.url').'/api/users/verify-email?token='.$code->code,
            'applicationName' => config('app.name'),
            'expiresAt' => $code->expires_at,
        ], function($m) use ($company) {
            $m->to($company->company_email)->subject('Verify your email address');
        });
        $code->email_sent = true; $code->save();

        return response()->json([
            'message' => 'Company created successfully',
            'id' => $company->id,
        ], 201);
    }

}
