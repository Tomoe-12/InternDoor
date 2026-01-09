import { NextRequest, NextResponse } from "next/server";
import { CompanyService } from "@/server/services/company.service";

/**
 * Test endpoint to debug company registration
 * POST /api/test/register-company
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Test registration request:", body);

    const result = await CompanyService.createCompany({
      companyName: body.companyName || "Test Company",
      companyEmail: body.companyEmail || `test-${Date.now()}@example.com`,
      password: body.password || "TestPassword123!",
      passwordConfirmation: body.passwordConfirmation || "TestPassword123!",
      website: body.website,
      phoneNumber: body.phoneNumber || "+1234567890",
    });

    console.log("Company created:", result);

    return NextResponse.json(
      {
        success: true,
        message: "Company registered successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 400 }
    );
  }
}
