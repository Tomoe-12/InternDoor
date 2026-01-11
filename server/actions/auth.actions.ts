"use server";

import { actionClient, z } from "@/server/config/action";
import {
  emailVerificationRequestSchema,
  emailVerificationConfirmSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
  loginSchema,
} from "@/server/schemas/auth.schema";
import { createStudentSchema } from "@/server/schemas/student.schema";
import { createCompanySchema } from "@/server/schemas/company.schema";
import { VerificationService } from "@/server/services/verification.service";
import { PasswordResetService } from "@/server/services/password-reset.service";
import { SupabaseAuthService } from "@/server/services/supabase-auth.service";

/**
 * Login action
 */
export const loginAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput }) => {
    const result = await AuthService.login(parsedInput);
    return result;
  });

/**
 * Get current user action
 */
export const getCurrentUserAction = actionClient
  .schema(z.object({ token: z.string() }))
  .action(async ({ parsedInput }) => {
    const user = await AuthService.getCurrentUser(parsedInput.token);
    return user;
  });

/**
 * Request email verification code
 */
export const requestEmailVerificationAction = actionClient
  .schema(emailVerificationRequestSchema)
  .action(async ({ parsedInput }) => {
    const result = await VerificationService.requestVerificationCode(parsedInput);
    return result;
  });

/**
 * Verify email code
 */
export const verifyEmailCodeAction = actionClient
  .schema(emailVerificationConfirmSchema)
  .action(async ({ parsedInput }) => {
    const result = await VerificationService.verifyCode(parsedInput);
    return result;
  });

/**
 * Request password reset
 */
export const requestPasswordResetAction = actionClient
  .schema(passwordResetRequestSchema)
  .action(async ({ parsedInput }) => {
    const result = await PasswordResetService.requestPasswordReset(parsedInput);
    return result;
  });

/**
 * Verify password reset token
 */
export const verifyPasswordResetTokenAction = actionClient
  .schema(z.object({ token: z.string() }))
  .action(async ({ parsedInput }) => {
    const result = await PasswordResetService.verifyToken(parsedInput.token);
    return result;
  });

/**
 * Reset password with token
 */
export const resetPasswordAction = actionClient
  .schema(passwordResetConfirmSchema)
  .action(async ({ parsedInput }) => {
    const result = await PasswordResetService.resetPassword(parsedInput);
    return result;
  });

/**
 * Register a new student
 */
export const registerStudentAction = actionClient
  .schema(createStudentSchema)
  .action(async ({ parsedInput }) => {
    try {
      const result = await SupabaseAuthService.registerStudent(parsedInput);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to register student";
      return { error: errorMessage };
    }
  });

/**
 * Register a new company
 */
export const registerCompanyAction = actionClient
  .schema(createCompanySchema)
  .action(async ({ parsedInput }) => {
    try {
      const result = await SupabaseAuthService.registerCompany(parsedInput);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to register company";
      return { error: errorMessage };
    }
  });
