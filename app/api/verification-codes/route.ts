import { NextRequest, NextResponse } from "next/server";
import { VerificationService } from "@/server/services/verification.service";
import { emailVerificationRequestSchema } from "@/server/schemas/auth.schema";

export const runtime = "nodejs";

/**
 * POST /api/verification-codes - Request verification code
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = emailVerificationRequestSchema.parse(body);
    const result = await VerificationService.requestVerificationCode(validatedData);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
