import { z } from "zod";

/**
 * Student creation schema
 */
export const createStudentSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  passwordConfirmation: z.string(),
  fullName: z.string(),
  role: z.enum(["STUDENT", "USER", "ADMIN", "UNIVERSITY_ADMIN"]).default("STUDENT"),
  universityId: z.string().optional(), // Required for UNIVERSITY_ADMIN role
  status: z.string().default("Active"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;

/**
 * Student update schema
 */
export const updateStudentSchema = z.object({
  id: z.number(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  status: z.string().optional(),
});

export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;

/**
 * Get students query schema
 */
export const getStudentsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  size: z.coerce.number().min(1).max(100).default(10),
});

export type GetStudentsInput = z.infer<typeof getStudentsSchema>;
