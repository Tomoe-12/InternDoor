import { db } from "@/db/client";
import { students } from "@/db/schema/students";
import { companies } from "@/db/schema/companies";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/server/lib/password";
import { signToken, type JWTPayload } from "@/server/lib/auth/jwt";
import { logger } from "@/server/lib/logger";
import type { LoginInput } from "@/server/schemas/auth.schema";

export interface AuthResult {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    type: "student" | "company";
    firstName?: string;
    lastName?: string;
    fullName?: string;
    profileImageUrl?: string;
  };
}

/**
 * Authentication service for login and session management
 */
export class AuthService {
  /**
   * Authenticate a user (student or company) and return JWT token
   */
  static async login(input: LoginInput): Promise<AuthResult> {
    const { email, password } = input;

    logger.info({ email }, "Attempting login");

    // Try to find student first
    let user: (typeof students.$inferSelect) | (typeof companies.$inferSelect) | null = null;
    let userType: "student" | "company" = "student";

    const [student] = await db.select().from(students).where(eq(students.email, email)).limit(1);
    if (student) {
      user = student;
      userType = "student";
    } else {
      const [company] = await db.select().from(companies).where(eq(companies.companyEmail, email)).limit(1);
      if (company) {
        user = company;
        userType = "company";
      }
    }

    if (!user || !user.password) {
      logger.warn({ email }, "Login failed: user not found");
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      logger.warn({ email }, "Login failed: invalid password");
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const jwtPayload: JWTPayload = {
      userId: user.id,
      email: userType === "student" ? (user as typeof students.$inferSelect).email : (user as typeof companies.$inferSelect).companyEmail,
      role: user.role || (userType === "student" ? "STUDENT" : "COMPANY"),
      type: userType,
    };

    const token = await signToken(jwtPayload);

    logger.info({ email, userId: user.id, type: userType }, "Login successful");

    return {
      token,
      user: {
        id: user.id,
        email: jwtPayload.email,
        role: jwtPayload.role,
        type: userType,
        firstName: userType === "student" ? (user as typeof students.$inferSelect).fullName?.split(" ")[0] : undefined,
        lastName: userType === "student" ? (user as typeof students.$inferSelect).fullName?.split(" ").slice(1).join(" ") : undefined,
        fullName: userType === "student" ? (user as typeof students.$inferSelect).fullName : (user as typeof companies.$inferSelect).companyName,
        profileImageUrl: userType === "student" ? (user as typeof students.$inferSelect).profileImageUrl : (user as typeof companies.$inferSelect).logo,
      },
    };
  }

  /**
   * Get current user from token
   */
  static async getCurrentUser(token: string) {
    const { verifyToken } = await import("@/server/lib/auth/jwt");
    const payload = await verifyToken(token);

    if (payload.type === "student") {
      const [user] = await db.select().from(students).where(eq(students.id, payload.userId)).limit(1);
      if (!user) throw new Error("User not found");
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.fullName?.split(" ")[0],
        lastName: user.fullName?.split(" ").slice(1).join(" "),
        fullName: user.fullName,
        profileImageUrl: user.profileImageUrl,
        type: "student" as const,
      };
    } else {
      const [user] = await db.select().from(companies).where(eq(companies.id, payload.userId)).limit(1);
      if (!user) throw new Error("User not found");
      return {
        id: user.id,
        email: user.companyEmail,
        role: "COMPANY",
        fullName: user.companyName,
        profileImageUrl: user.logo,
        type: "company" as const,
      };
    }
  }
}
