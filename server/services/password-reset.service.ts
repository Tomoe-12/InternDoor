import { db } from "@/db/client";
import { passwordResetTokens } from "@/db/schema/password_reset_tokens";
import { students } from "@/db/schema/students";
import { companies } from "@/db/schema/companies";
import { eq, and, sql } from "drizzle-orm";
import { generateToken } from "@/server/lib/crypto";
import { sendPasswordResetEmail } from "@/server/lib/email";
import { hashPassword, verifyPassword } from "@/server/lib/password";
import type { PasswordResetRequestInput, PasswordResetConfirmInput } from "@/server/schemas/auth.schema";
import type { PasswordResetResult } from "@/server/types/common";

const TOKEN_EXPIRY_HOURS = 1;

/**
 * Password reset service
 */
export class PasswordResetService {
  /**
   * Request a password reset token
   */
  static async requestPasswordReset(input: PasswordResetRequestInput) {
    const { email } = input;

    // Find user by email (check both students and companies)
    const [studentResult] = await db
      .select()
      .from(students)
      .where(eq(students.email, email))
      .limit(1);

    const [companyResult] = await db
      .select()
      .from(companies)
      .where(eq(companies.companyEmail, email))
      .limit(1);

    if (!studentResult && !companyResult) {
      // Don't reveal if email exists for security
      return {
        success: true,
        message: "If the email exists, a password reset link has been sent",
      };
    }

    const token = generateToken(32);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    // Store token
    const result = await db
      .insert(passwordResetTokens)
      .values({
        studentId: studentResult?.id ?? null,
        companyId: companyResult?.id ?? null,
        token,
        expiresAt,
        emailSent: false,
      })
      .returning();

    // Generate reset link
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`;

    // Send email
    const emailResult = await sendPasswordResetEmail(email, resetLink);

    if (emailResult.success) {
      // Mark as sent
      await db
        .update(passwordResetTokens)
        .set({ emailSent: true })
        .where(eq(passwordResetTokens.id, result[0].id));
    }

    return {
      success: true,
      tokenId: result[0].id,
      expiresAt,
      emailSent: emailResult.success,
    };
  }

  /**
   * Verify a password reset token
   */
  static async verifyToken(token: string): Promise<PasswordResetResult> {
    const records = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))
      .limit(1);

    if (!records || records.length === 0) {
      return {
        valid: false,
      };
    }

    const record = records[0];

    // Check expiry
    if (!record.expiresAt || new Date() > record.expiresAt) {
      return {
        valid: false,
      };
    }

    return {
      valid: true,
      studentId: record.studentId,
      companyId: record.companyId,
    };
  }

  /**
   * Reset password using token
   */
  static async resetPassword(input: PasswordResetConfirmInput) {
    const { token, password } = input;

    // Verify token
    const tokenResult = await this.verifyToken(token);
    if (!tokenResult.valid) {
      throw new Error("Invalid or expired token");
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password
    if (tokenResult.studentId) {
      await db
        .update(students)
        .set({ password: hashedPassword, updatedAt: new Date() })
        .where(eq(students.id, tokenResult.studentId));
    } else if (tokenResult.companyId) {
      await db
        .update(companies)
        .set({ password: hashedPassword, updatedAt: new Date() })
        .where(eq(companies.id, tokenResult.companyId));
    } else {
      throw new Error("Invalid token: no associated user");
    }

    // Delete used token
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));

    return {
      success: true,
      message: "Password reset successfully",
    };
  }
}
