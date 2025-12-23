<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
        $company->save();

        return response()->json([
            'message' => 'Company created successfully',
            'id' => $company->id,
        ], 201);
    }
}
