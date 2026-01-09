import { z } from "zod";

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;

/**
 * Password reset confirmation schema
 */
export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  passwordConfirmation: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

export type PasswordResetConfirmInput = z.infer<typeof passwordResetConfirmSchema>;

/**
 * Email verification request schema
 */
export const emailVerificationRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  studentId: z.number().optional(),
  companyId: z.number().optional(),
});

export type EmailVerificationRequestInput = z.infer<typeof emailVerificationRequestSchema>;

/**
 * Email verification confirm schema
 */
export const emailVerificationConfirmSchema = z.object({
  code: z.string().min(1, "Verification code is required"),
});

export type EmailVerificationConfirmInput = z.infer<typeof emailVerificationConfirmSchema>;
