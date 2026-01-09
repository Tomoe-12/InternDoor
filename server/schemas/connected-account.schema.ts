import { z } from "zod";

/**
 * Get connected accounts schema
 */
export const getConnectedAccountsSchema = z.object({
  studentId: z.coerce.number().optional(),
  companyId: z.coerce.number().optional(),
}).refine((data) => data.studentId || data.companyId, {
  message: "Either studentId or companyId is required",
});

export type GetConnectedAccountsInput = z.infer<typeof getConnectedAccountsSchema>;

/**
 * Create connected account schema
 */
export const createConnectedAccountSchema = z.object({
  studentId: z.number().optional(),
  companyId: z.number().optional(),
  provider: z.string().min(1, "Provider is required"),
  providerId: z.string().min(1, "Provider ID is required"),
}).refine((data) => data.studentId || data.companyId, {
  message: "Either studentId or companyId is required",
});

export type CreateConnectedAccountInput = z.infer<typeof createConnectedAccountSchema>;

/**
 * Delete connected account schema
 */
export const deleteConnectedAccountSchema = z.object({
  id: z.number(),
});

export type DeleteConnectedAccountInput = z.infer<typeof deleteConnectedAccountSchema>;
