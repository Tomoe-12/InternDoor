import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .refine((val) => !/\s/.test(val), "Password cannot contain spaces")
    .refine(
      (val) => /[A-Z]/.test(val),
      "Must contain at least 1 uppercase letter"
    )
    .refine(
      (val) => /[a-z]/.test(val),
      "Must contain at least 1 lowercase letter"
    )
    .refine((val) => /\d/.test(val), "Must contain at least 1 number"),
});

