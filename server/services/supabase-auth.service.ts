import { supabase } from "@/lib/supabase";
import { db } from "@/db/client";
import { students } from "@/db/schema/students";
import { companies } from "@/db/schema/companies";
import { logger } from "@/server/lib/logger";
import { sendCompanyWelcomeEmail } from "@/server/lib/email";

/**
 * Supabase Auth Service
 * Handles user registration via Supabase Auth + domain row creation
 */
export class SupabaseAuthService {
  /**
   * Register a new student with Supabase Auth
   */
  static async registerStudent(input: {
    email: string;
    password: string;
    fullName: string;
    role?: string;
    status?: string;
  }) {
    const { email, password, fullName, role = "STUDENT", status = "Active" } =
      input;

    const normalizedEmail = email.trim().toLowerCase();

    logger.info({ email: normalizedEmail }, "Registering new student with Supabase");

    try {
      // Check if email already exists in students table
      const { data: existingStudent } = await supabase
        .from("students")
        .select("id")
        .eq("email", normalizedEmail)
        .single();

      if (existingStudent) {
        return { error: "Student with this email already exists" };
      }

      // Check if email exists in companies table
      const { data: existingCompany } = await supabase
        .from("companies")
        .select("id")
        .eq("companyEmail", normalizedEmail)
        .single();

      if (existingCompany) {
        return { error: "This email is already used by a company account" };
      }

      // Create auth user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
      });

      if (authError) {
        logger.error(
          { email: normalizedEmail, authError },
          "Failed to create Supabase auth user"
        );
        return { error: authError.message || "Failed to create auth user" };
      }

      if (!authData.user) {
        return { error: "Failed to create auth user" };
      }

      // Create student row in database
      const { data: studentData, error: dbError } = await supabase
        .from("students")
        .insert({
          email: normalizedEmail,
          fullName: fullName.trim(),
          role,
          status,
          verified: false, // Will be true after email verification
        })
        .select()
        .single();

      if (dbError) {
        logger.error(
          { email: normalizedEmail, dbError },
          "Failed to create student row"
        );
        // Clean up: delete auth user if domain row creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { error: "Failed to create student profile" };
      }

      // Send verification email (Supabase Auth handles the template)
      // Note: If email provider is enabled in Supabase, the verification email is sent automatically
      // If you want to send a custom email, uncomment below:
      // try {
      //   await sendVerificationEmail(normalizedEmail, verificationCode);
      //   logger.info({ email: normalizedEmail }, "Verification email sent");
      // } catch (emailError) {
      //   logger.error(
      //     { email: normalizedEmail, emailError },
      //     "Failed to send verification email (non-fatal)"
      //   );
      // }

      logger.info(
        { email: normalizedEmail, id: studentData?.id },
        "Student registered successfully"
      );

      return {
        success: "Student registered successfully. Please verify your email.",
        data: studentData,
      };
    } catch (err: any) {
      logger.error(
        { email: normalizedEmail, error: err },
        "Unexpected error during student registration"
      );
      return { error: err?.message || "Failed to register student" };
    }
  }

  /**
   * Register a new company with Supabase Auth
   */
  static async registerCompany(input: {
    email: string;
    password: string;
    companyName: string;
    website?: string;
    phoneNumber?: string;
    role?: string;
    status?: string;
  }) {
    const {
      email,
      password,
      companyName,
      website,
      phoneNumber,
      role = "COMPANY",
      status = "Active",
    } = input;

    const normalizedEmail = email.trim().toLowerCase();

    logger.info(
      { email: normalizedEmail, companyName },
      "Registering new company with Supabase"
    );

    try {
      // Check if email already exists in companies table
      const { data: existingCompany } = await supabase
        .from("companies")
        .select("id")
        .eq("companyEmail", normalizedEmail)
        .single();

      if (existingCompany) {
        return { error: "Company with this email already exists" };
      }

      // Check if email exists in students table
      const { data: existingStudent } = await supabase
        .from("students")
        .select("id")
        .eq("email", normalizedEmail)
        .single();

      if (existingStudent) {
        return { error: "This email is already used by a student account" };
      }

      // Create auth user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
      });

      if (authError) {
        logger.error(
          { email: normalizedEmail, authError },
          "Failed to create Supabase auth user"
        );
        return { error: authError.message || "Failed to create auth user" };
      }

      if (!authData.user) {
        return { error: "Failed to create auth user" };
      }

      // Create company row in database
      const { data: companyData, error: dbError } = await supabase
        .from("companies")
        .insert({
          companyEmail: normalizedEmail,
          companyName: companyName.trim(),
          website: website || null,
          phoneNumber: phoneNumber || null,
          role,
          status,
          verified: true, // Companies auto-verified
        })
        .select()
        .single();

      if (dbError) {
        logger.error(
          { email: normalizedEmail, dbError },
          "Failed to create company row"
        );
        // Clean up: delete auth user if domain row creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { error: "Failed to create company profile" };
      }

      // Send welcome email
      try {
        await sendCompanyWelcomeEmail(normalizedEmail, companyName);
        logger.info({ email: normalizedEmail }, "Welcome email sent to company");
      } catch (emailError) {
        logger.error(
          { email: normalizedEmail, emailError },
          "Failed to send welcome email (non-fatal)"
        );
      }

      logger.info(
        { email: normalizedEmail, id: companyData?.id },
        "Company registered successfully"
      );

      return {
        success: "Company registered successfully. You can now sign in.",
        data: companyData,
      };
    } catch (err: any) {
      logger.error(
        { email: normalizedEmail, error: err },
        "Unexpected error during company registration"
      );
      return { error: err?.message || "Failed to register company" };
    }
  }
}
