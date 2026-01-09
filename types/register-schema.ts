import { z } from "zod";

export const registerSchema = z
  .object({
    role: z.enum(["student", "company"], {
      required_error: "Role is required",
    }),
    name: z.string().trim().optional(),
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
    companyName: z.string().trim().optional(),
    companyWebsite: z.string().trim().optional(),
    phoneNumber: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }

    if (data.role === "student") {
      if (!data.name || !data.name.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["name"],
          message: "Full name is required",
        });
      }
    }

    if (data.role === "company") {
      if (!data.companyName || !data.companyName.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyName"],
          message: "Company name is required",
        });
      }

      if (!data.phoneNumber || !data.phoneNumber.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phoneNumber"],
          message: "Phone number is required",
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
    }
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
