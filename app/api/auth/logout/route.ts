import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/server/lib/logger";

export const runtime = "nodejs";

/**
 * POST /api/auth/logout - Logout endpoint
 * Note: With JWT, logout is handled client-side by removing the token
 * This endpoint exists for logging purposes and potential token blacklisting in the future
 */
export async function POST(request: NextRequest) {
  try {
    // In the future, you could implement token blacklisting here
    // For now, just log the logout
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      logger.info("User logged out");
    }

    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : "Unknown error" }, "Logout failed");
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
