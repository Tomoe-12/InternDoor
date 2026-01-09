import { z } from "zod";

/**
 * Company creation schema
 */
export const createCompanySchema = z
  .object({
    companyName: z.string().min(1, "Company name is required"),
    companyEmail: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirmation: z.string(),
    website: z.string().url().optional().or(z.literal("")),
    phoneNumber: z.string().optional(),
    industry: z.string().optional(),
    organizationSize: z.string().optional(),
    organizationType: z.string().optional(),
    address: z.string().optional(),
    description: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;

/**
 * Company update schema
 */
export const updateCompanySchema = z.object({
  id: z.number(),
  companyName: z.string().optional(),
  companyEmail: z.string().email().optional(),
  website: z.string().url().optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
});

export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;

/**
 * Get companies query schema
 */
export const getCompaniesSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  size: z.coerce.number().min(1).max(100).default(10),
});

export type GetCompaniesInput = z.infer<typeof getCompaniesSchema>;
