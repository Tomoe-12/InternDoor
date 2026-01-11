import { db } from "@/db/client";
import { students } from "@/db/schema/students";
import { companies } from "@/db/schema/companies";
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from "@/server/lib/email";
import { generateToken } from "@/server/lib/crypto";
import { logger } from "@/server/lib/logger";

/**
 * Email Verification Service
 * 
 * Features:
 * - Token expires in 1 hour
 * - Auto-resend on login if expired
 * - Smart messages based on token status
 * - Works with students and companies tables
 */

const VERIFICATION_TOKEN_EXPIRY_MINUTES = 60; // 1 hour

export class EmailVerificationService {
  /**
   * Send verification email to user (student or company)
   */
  static async sendVerificationEmail(email: string, userType?: "student" | "company") {
    try {
      let user = null;
      let actualUserType = userType;

      // Try to find user in both tables if type not specified
      if (!actualUserType) {
        const [student] = await db
          .select()
          .from(students)
          .where(eq(students.email, email))
          .limit(1);

        if (student) {
          user = student;
          actualUserType = "student";
        } else {
          const [company] = await db
            .select()
            .from(companies)
            .where(eq(companies.companyEmail, email))
            .limit(1);

          if (company) {
            user = company;
            actualUserType = "company";
          }
        }
      } else if (actualUserType === "student") {
        const [student] = await db
          .select()
          .from(students)
          .where(eq(students.email, email))
          .limit(1);
        user = student;
      } else if (actualUserType === "company") {
        const [company] = await db
          .select()
          .from(companies)
          .where(eq(companies.companyEmail, email))
          .limit(1);
        user = company;
      }

      if (!user) {
        throw new Error("User not found");
      }

      // Generate new verification token
      const verificationToken = generateToken(32);
      const expiryTime = new Date(
        Date.now() + VERIFICATION_TOKEN_EXPIRY_MINUTES * 60 * 1000
      );

      // Update user with new token
      if (actualUserType === "student") {
        await db
          .update(students)
          .set({
            verificationToken: verificationToken,
            verificationTokenExpiry: expiryTime,
          } as any)
          .where(eq(students.id, (user as any).id));
      } else {
        await db
          .update(companies)
          .set({
            verificationToken: verificationToken,
            verificationTokenExpiry: expiryTime,
          } as any)
          .where(eq(companies.id, (user as any).id));
      }

      // Send email
      const userEmail = actualUserType === "student" ? email : (user as any).companyEmail;
      await sendVerificationEmail(userEmail, verificationToken);

      logger.info({ email }, "Verification email sent");

      return {
        success: true,
        message: "Verification email sent",
        expiresAt: expiryTime,
      };
    } catch (error) {
      logger.error({ email, error }, "Failed to send verification email");
      throw error;
    }
  }

  /**
   * Check user's verification status
   * Used during login to determine what message to show
   */
  static async checkVerificationStatus(
    id: number,
    userType: "student" | "company"
  ) {
    let user = null;

    if (userType === "student") {
      const [student] = await db
        .select()
        .from(students)
        .where(eq(students.id, id))
        .limit(1);
      user = student;
    } else {
      const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.id, id))
        .limit(1);
      user = company;
    }

    if (!user) {
      throw new Error("User not found");
    }

    // User is already verified
    if ((user as any).verified === true) {
      return {
        status: "verified",
        message: "Email already verified",
        action: "none",
      };
    }

    const now = new Date();
    const tokenExpired =
      !(user as any).verificationTokenExpiry ||
      (user as any).verificationTokenExpiry < now;

    if (tokenExpired) {
      // STATE 1: Token is EXPIRED
      // Auto-resend new verification email
      const email = userType === "student" ? (user as any).email : (user as any).companyEmail;
      await this.sendVerificationEmail(email, userType);

      return {
        status: "expired",
        message:
          "Your verification link expired. We've resent it to your email. Please check your inbox.",
        action: "check_email",
        expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MINUTES * 60 * 1000),
      };
    } else {
      // STATE 2: Token is VALID
      // Don't resend, just remind user to verify
      const timeRemaining = Math.ceil(
        ((user as any).verificationTokenExpiry.getTime() - now.getTime()) / 1000 / 60
      );

      return {
        status: "pending",
        message: `Please verify your email. Your verification link expires in ${timeRemaining} minutes.`,
        action: "verify_email",
        expiresAt: (user as any).verificationTokenExpiry,
      };
    }
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token: string, userType: "student" | "company") {
    let user = null;

    if (userType === "student") {
      const [student] = await db
        .select()
        .from(students)
        .where(eq(students.verificationToken as any, token))
        .limit(1);
      user = student;
    } else {
      const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.verificationToken as any, token))
        .limit(1);
      user = company;
    }

    if (!user) {
      throw new Error("Invalid verification token");
    }

    const now = new Date();

    // Check if token expired
    if (!(user as any).verificationTokenExpiry || (user as any).verificationTokenExpiry < now) {
      throw new Error(
        "Verification token expired. Please request a new one."
      );
    }

    // Mark email as verified
    let updatedUser;
    if (userType === "student") {
      const result = await db
        .update(students)
        .set({
          verified: true,
          verificationToken: null as any,
          verificationTokenExpiry: null as any,
        })
        .where(eq(students.id, (user as any).id))
        .returning();
      updatedUser = result[0];
    } else {
      const result = await db
        .update(companies)
        .set({
          verified: true,
          verificationToken: null as any,
          verificationTokenExpiry: null as any,
        })
        .where(eq(companies.id, (user as any).id))
        .returning();
      updatedUser = result[0];
    }

    logger.info({ email: (user as any).email }, "Email verified successfully");

    return {
      success: true,
      message: "Email verified successfully!",
      user: updatedUser,
    };
  }

  /**
   * Manually request new verification email
   */
  static async resendVerificationEmail(email: string, userType: "student" | "company") {
    return await this.sendVerificationEmail(email, userType);
  }
}
