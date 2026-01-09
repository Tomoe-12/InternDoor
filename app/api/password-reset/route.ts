import { NextRequest, NextResponse } from "next/server";
import { PasswordResetService } from "@/server/services/password-reset.service";
import { passwordResetRequestSchema, passwordResetConfirmSchema } from "@/server/schemas/auth.schema";

export const runtime = "nodejs";

/**
 * POST /api/password-reset - Request password reset
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = passwordResetRequestSchema.parse(body);
    const result = await PasswordResetService.requestPasswordReset(validatedData);
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

/**
 * PUT /api/password-reset - Reset password with token
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = passwordResetConfirmSchema.parse(body);
    const result = await PasswordResetService.resetPassword(validatedData);
    return NextResponse.json(result);
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
