import { z } from "zod";

export const registerSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(1, "Company name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((val) => !/\s/.test(val), "Password cannot contain spaces")
      .refine((val) => /[A-Z]/.test(val), "Must contain at least 1 uppercase letter")
      .refine((val) => /[a-z]/.test(val), "Must contain at least 1 lowercase letter")
      .refine((val) => /\d/.test(val), "Must contain at least 1 number"),
    confirmPassword: z.string(),
    companyWebsite: z.string().trim().optional(),
    phoneNumber: z
      .string()
      .trim()
      .min(1, "Phone number is required"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }

    if (data.companyWebsite && data.companyWebsite.trim()) {
      try {
        // Using URL constructor for basic validation
        // eslint-disable-next-line no-new
        new URL(data.companyWebsite);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyWebsite"],
          message: "Enter a valid URL (e.g., https://example.com)",
        });
      }
    }
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
