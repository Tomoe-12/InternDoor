"use server";

import { actionClient, z } from "@/server/config/action";
import {
  emailVerificationRequestSchema,
  emailVerificationConfirmSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
} from "@/server/schemas/auth.schema";
import { createStudentSchema } from "@/server/schemas/student.schema";
import { createCompanySchema } from "@/server/schemas/company.schema";
import { VerificationService } from "@/server/services/verification.service";
import { PasswordResetService } from "@/server/services/password-reset.service";
import { SupabaseAuthService } from "@/server/services/supabase-auth.service";

/**
 * DEPRECATED: Use useSupabaseAuth() hook for login instead
 * Login is now handled entirely by Supabase Auth on the client
 */
export const loginAction = actionClient
  .schema(z.object({ email: z.string(), password: z.string() }))
  .action(async () => {
    throw new Error(
      "loginAction is deprecated. Use useSupabaseAuth().login() instead."
    );
  });

/**
 * DEPRECATED: Use supabase.auth.getUser() instead
 * Get current user from Supabase Auth session
 */
export const getCurrentUserAction = actionClient
  .schema(z.object({ token: z.string() }))
  .action(async () => {
    throw new Error(
      "getCurrentUserAction is deprecated. Use useSupabaseAuth() hook instead."
    );
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
