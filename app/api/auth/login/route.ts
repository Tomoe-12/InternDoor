import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { EmailVerificationService } from "@/server/services/email-verification.service";
import { loginSchema } from "@/server/schemas/auth.schema";
import { logger } from "@/server/lib/logger";

export const runtime = "nodejs";

/**
 * POST /api/auth/login - Login endpoint with email verification check
 * 
 * Implements email verification flow:
 * - If email verified → allow login
 * - If token expired → auto-resend + show message
 * - If token valid → remind to verify
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    // Step 1: Authenticate user
    const result = await AuthService.login(validatedData);

    // Step 2: Check email verification status
    const verificationStatus =
      await EmailVerificationService.checkVerificationStatus(
        result.user.id,
        result.user.type // "student" or "company"
      );

    // Step 3: Return response based on verification status
    if (verificationStatus.status === "verified") {
      // ✅ Email verified, allow login
      return NextResponse.json({
        success: true,
        message: "Login successful",
        token: result.token,
        user: result.user,
        requiresEmailVerification: false,
      });
    }

    if (verificationStatus.status === "expired") {
      // STATE 1: Token EXPIRED
      // Auto-resent new email, show "check email" message
      return NextResponse.json(
        {
          success: false,
          requiresEmailVerification: true,
          verificationStatus: "expired",
          verificationMessage: verificationStatus.message,
          // "Your verification link expired. We've resent it to your email. Please check your inbox."
          expiresAt: verificationStatus.expiresAt,
          message:
            "Please verify your email. New verification email has been sent.",
        },
        { status: 403 }
      );
    }

    if (verificationStatus.status === "pending") {
      // STATE 2: Token VALID (not expired)
      // Don't resend, just remind user
      return NextResponse.json(
        {
          success: false,
          requiresEmailVerification: true,
          verificationStatus: "pending",
          verificationMessage: verificationStatus.message,
          // "Please verify your email. Your verification link expires in X minutes."
          expiresAt: verificationStatus.expiresAt,
          message: "Please verify your email before logging in.",
        },
        { status: 403 }
      );
    }

    throw new Error("Unknown verification status");
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : "Unknown error" }, "Login failed");

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.message }, { status: 400 });
    }

    if (error instanceof Error && error.message.includes("Invalid")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
