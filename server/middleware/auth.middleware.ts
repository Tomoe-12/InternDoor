import { NextRequest } from "next/server";
import { verifyToken, extractTokenFromHeader } from "@/server/lib/auth/jwt";
import { logger } from "@/server/lib/logger";

export interface AuthRequest extends NextRequest {
  user?: {
    userId: number;
    email: string;
    role: string;
    type: "student" | "company";
  };
}

/**
 * Middleware to authenticate requests
 * Adds user info to request if token is valid
 */
export async function authenticateRequest(request: NextRequest): Promise<{
  authenticated: boolean;
  user?: {
    userId: number;
    email: string;
    role: string;
    type: "student" | "company";
  };
  error?: string;
}> {
  try {
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      logger.debug("No token provided in request");
      return { authenticated: false, error: "No token provided" };
    }

    const payload = await verifyToken(token);
    
    logger.debug({ userId: payload.userId, email: payload.email }, "Request authenticated");

    return {
      authenticated: true,
      user: {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        type: payload.type,
      },
    };
  } catch (error) {
    logger.warn({ error: error instanceof Error ? error.message : "Unknown error" }, "Authentication failed");
    return {
      authenticated: false,
      error: error instanceof Error ? error.message : "Authentication failed",
    };
  }
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth.authenticated || !auth.user) {
    throw new Error(auth.error || "Authentication required");
  }
  return auth.user;
}
