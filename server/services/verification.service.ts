import { db } from "@/db/client";
import { verificationCodes } from "@/db/schema/verification_codes";
import { eq, and, gt, sql } from "drizzle-orm";
import { generateVerificationCode } from "@/server/lib/crypto";
import { sendVerificationEmail } from "@/server/lib/email";
import { logger } from "@/server/lib/logger";
import type {
  EmailVerificationRequestInput,
  EmailVerificationConfirmInput,
} from "@/server/schemas/auth.schema";
import type { EmailVerificationResult } from "@/server/types/common";

const CODE_EXPIRY_MINUTES = 15;

/**
 * Verification service for email verification codes
 */
export class VerificationService {
  /**
   * Request a verification code
   */
  static async requestVerificationCode(input: EmailVerificationRequestInput) {
    const { email, studentId, companyId } = input;

    logger.info(
      { email, studentId, companyId },
      "Requesting verification code"
    );

    if (!studentId && !companyId) {
      throw new Error("Either studentId or companyId is required");
    }

    // Generate code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

    // Store verification code
    const result = await db
      .insert(verificationCodes)
      .values({
        studentId: studentId ?? null,
        companyId: companyId ?? null,
        code,
        expiresAt,
        emailSent: false,
      })
      .returning();

    const inserted = result?.[0];
    if (!inserted) {
      logger.error({ email }, "Failed to store verification code");
      throw new Error("Failed to store verification code");
    }
    // Send email
    const emailResult = await sendVerificationEmail(email, code);

    if (emailResult.success) {
      // Mark as sent
      await db
        .update(verificationCodes)
        .set({ emailSent: true })
        .where(eq(verificationCodes.id, inserted.id));
      logger.info(
        { email, codeId: inserted.id },
        "Verification code sent successfully"
      );
    } else {
      logger.warn(
        { email, error: emailResult.error },
        "Failed to send verification email"
      );
    }

    return {
      codeId: inserted.id,
      expiresAt,
      emailSent: emailResult.success,
    };
  }

  /**
   * Verify a code
   */
  static async verifyCode(
    input: EmailVerificationConfirmInput
  ): Promise<EmailVerificationResult> {
    const { code } = input;

    // Find code
    const records = await db
      .select()
      .from(verificationCodes)
      .where(eq(verificationCodes.code, code))
      .limit(1);

    if (!records || records.length === 0) {
      return {
        valid: false,
      };
    }

    const record = records[0];
    if (!record) {
      return {
        valid: false,
      };
    }
    // Check expiry safely
    const expiresAt = record.expiresAt;
    if (!expiresAt) {
      return { valid: false };
    }
    if (new Date() > expiresAt) {
      return { valid: false };
    }

    // Check expiry
    if (new Date() > record.expiresAt) {
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
   * Delete a verification code
   */
  static async deleteCode(id: number) {
    await db.delete(verificationCodes).where(eq(verificationCodes.id, id));
    return { success: true };
  }
}
