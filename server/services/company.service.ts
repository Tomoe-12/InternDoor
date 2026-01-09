import { db } from "@/db/client";
import { companies } from "@/db/schema/companies";
import { students } from "@/db/schema/students";
import { eq, count, sql } from "drizzle-orm";
import { hashPassword } from "@/server/lib/password";
import { sendCompanyWelcomeEmail } from "@/server/lib/email";
import { logger } from "@/server/lib/logger";
import type {
  CreateCompanyInput,
  UpdateCompanyInput,
  GetCompaniesInput,
} from "@/server/schemas/company.schema";
import type { PaginatedResponse } from "@/server/types/common";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Company service for business logic related to companies
 */
export class CompanyService {
  /**
   * Get all companies with pagination
   */
  static async getCompanies(
    params: GetCompaniesInput
  ): Promise<PaginatedResponse<typeof companies.$inferSelect>> {
    const { page = 1, size = DEFAULT_PAGE_SIZE } = params;
    const offset = (page - 1) * size;

    const [data, totalResult] = await Promise.all([
      db.select().from(companies).limit(size).offset(offset),
      db.select({ count: count() }).from(companies),
    ]);

    const totalCount = totalResult[0]?.count ?? 0;

    return {
      data,
      page,
      size,
      totalElements: totalCount,
      totalPages: Math.ceil(totalCount / size),
    };
  }

  /**
   * Get a company by ID
   */
  static async getCompanyById(id: number) {
    const result = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  /**
   * Get a company by email
   */
  static async getCompanyByEmail(email: string) {
    const normalized = email.trim().toLowerCase();
    const result = await db
      .select()
      .from(companies)
      .where(sql`lower(${companies.companyEmail}) = ${normalized}`)
      .limit(1);
    return result[0] ?? null;
  }

  /**
   * Check if email exists in students table
   */
  static async emailExistsInStudents(email: string) {
    const normalized = email.trim().toLowerCase();
    const rows = await db
      .select()
      .from(students)
      .where(sql`lower(${students.email}) = ${normalized}`)
      .limit(1);
    return rows.length > 0;
  }

  /**
   * Create a new company
   */
  static async createCompany(input: CreateCompanyInput) {
    const {
      password,
      passwordConfirmation,
      companyEmail,
      companyName,
      website,
      phoneNumber,
      ...otherFields
    } = input;

    const normalizedEmail = companyEmail.trim().toLowerCase();

    logger.info(
      { companyEmail: normalizedEmail, companyName },
      "Creating new company"
    );

    // Check if company already exists
    const existing = await this.getCompanyByEmail(normalizedEmail);
    if (existing) {
      logger.warn(
        { companyEmail: normalizedEmail },
        "Company creation failed: email already exists"
      );
      throw new Error("Company with this email already exists");
    }

    // Also prevent using an email already used by a student
    const usedByStudent = await this.emailExistsInStudents(normalizedEmail);
    if (usedByStudent) {
      logger.warn(
        { companyEmail: normalizedEmail },
        "Company creation failed: email already used by a student"
      );
      return { error: "This email is already in used by a student account" };
      // throw new Error("This email is already used by a student account");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert company
    let result;
    try {
      result = await db
        .insert(companies)
        .values({
          companyName,
          companyEmail: normalizedEmail,
          password: hashedPassword,
          website: website || null,
          phoneNumber: phoneNumber || null,
          ...otherFields,
        })
        .returning();

      if (!result || result.length === 0) {
        throw new Error("Failed to insert company into database");
      }

      logger.info(
        { companyEmail: normalizedEmail, id: result[0]?.id },
        "Company created successfully"
      );
    } catch (dbError: any) {
      logger.error(
        { companyEmail: normalizedEmail, error: dbError },
        "Database error while creating company"
      );
      if (
        dbError &&
        (dbError.code === "23505" || dbError.constraint?.includes("unique"))
      ) {
        throw new Error("Company with this email already exists");
      }
      throw new Error("Failed to create company in database");
    }

    // Send welcome email
    try {
      logger.info(
        { companyEmail: normalizedEmail },
        "Attempting to send welcome email"
      );
      const emailResult = await sendCompanyWelcomeEmail(
        normalizedEmail,
        companyName
      );
      logger.info(
        { companyEmail: normalizedEmail, emailResult },
        "Email send result received"
      );
      if (emailResult.success) {
        logger.info(
          { companyEmail: normalizedEmail },
          "Welcome email sent successfully"
        );
      } else {
        logger.warn(
          { companyEmail: normalizedEmail, error: emailResult.error },
          "Failed to send welcome email"
        );
      }
    } catch (emailError) {
      logger.error(
        { companyEmail: normalizedEmail, error: emailError },
        "Error sending welcome email"
      );
      // Don't throw - email failure shouldn't prevent account creation
    }

    return result[0];
  }

  /**
   * Update a company
   */
  static async updateCompany(input: UpdateCompanyInput) {
    const { id, ...updates } = input;

    const result = await db
      .update(companies)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(companies.id, id))
      .returning();

    return result[0] ?? null;
  }

  /**
   * Delete a company
   */
  static async deleteCompany(id: number) {
    await db.delete(companies).where(eq(companies.id, id));
    return { success: true };
  }
}
