import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { loginSchema } from "@/server/schemas/auth.schema";
import { logger } from "@/server/lib/logger";

export const runtime = "nodejs";

/**
 * POST /api/auth/login - Login endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const result = await AuthService.login(validatedData);

    return NextResponse.json(result);
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
