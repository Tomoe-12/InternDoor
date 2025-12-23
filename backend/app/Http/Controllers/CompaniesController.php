<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\VerificationCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class CompaniesController extends Controller
{
    /**
     * Store a newly created company.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'phone_number' => ['required', 'string', 'max:50'],
            'company_email' => ['required', 'email', 'max:255', 'unique:company,company_email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $company = new Company();
        $company->company_name = $validated['company_name'];
        $company->website = $validated['website'] ?? null;
        $company->phone_number = $validated['phone_number'];
        $company->company_email = $validated['company_email'];
        $company->password = Hash::make($validated['password']);
        $company->verified = false;
        $company->save();

        $code = VerificationCode::create([
            'company_id' => $company->id,
            'code' => (string) random_int(100000, 999999),
            'email_sent' => false,
        ]);

        Mail::raw(
            'Welcome! Please verify your company account by visiting: '.config('app.url').'/api/users/verify-email?token='.$code->code,
            function ($m) use ($company) {
                $m->to($company->company_email)->subject('Verify your company account');
            }
        );
        $code->email_sent = true; $code->save();

        return response()->json([
            'message' => 'Company created successfully',
            'id' => $company->id,
        ], 201);
    }
}
