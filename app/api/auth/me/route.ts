import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { requireAuth } from "@/server/middleware/auth.middleware";
import { logger } from "@/server/lib/logger";

export const runtime = "nodejs";

/**
 * GET /api/auth/me - Get current user
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await AuthService.getCurrentUser(token);

    return NextResponse.json(user);
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : "Unknown error" }, "Failed to get current user");

    if (error instanceof Error && error.message.includes("Invalid") || error.message.includes("expired")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
