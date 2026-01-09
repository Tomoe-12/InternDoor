import { db } from "@/db/client";
import { students } from "@/db/schema/students";
import { companies } from "@/db/schema/companies";
import { eq, count, sql } from "drizzle-orm";
import { hashPassword } from "@/server/lib/password";
import { logger } from "@/server/lib/logger";
import type {
  CreateStudentInput,
  UpdateStudentInput,
  GetStudentsInput,
} from "@/server/schemas/student.schema";
import type { PaginatedResponse } from "@/server/types/common";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Student service for business logic related to students
 */
export class StudentService {
  /**
   * Get all students with pagination
   */
  static async getStudents(
    params: GetStudentsInput
  ): Promise<PaginatedResponse<typeof students.$inferSelect>> {
    const { page = 1, size = DEFAULT_PAGE_SIZE } = params;
    const offset = (page - 1) * size;

    const [data, totalResult] = await Promise.all([
      db.select().from(students).limit(size).offset(offset),
      db.select({ count: count() }).from(students),
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
   * Get a student by ID
   */
  static async getStudentById(id: number) {
    const result = await db
      .select()
      .from(students)
      .where(eq(students.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  /**
   * Get a student by email
   */
  static async getStudentByEmail(email: string) {
    const normalized = email.trim().toLowerCase();
    const result = await db
      .select()
      .from(students)
      .where(sql`lower(${students.email}) = ${normalized}`)
      .limit(1);
    return result[0] ?? null;
  }

  /**
   * Check if email exists in companies table
   */
  static async emailExistsInCompanies(email: string) {
    console.log("email form student", email);

    const normalized = email.trim().toLowerCase();
    const rows = await db
      .select()
      .from(companies)
      .where(sql`lower(${companies.companyEmail}) = ${normalized}`)
      .limit(1);
    return rows.length > 0;
  }

  /**
   * Create a new student
   */
  static async createStudent(input: CreateStudentInput) {
    const {
      password,
      passwordConfirmation,
      fullName,
      email,
      role,
      status,
    } = input;
    // console.log('input' , input );
    
    const normalizedEmail = email.trim().toLowerCase();

    logger.info({ email: normalizedEmail }, "Creating new student");

    // Check if student already exists
    const existing = await this.getStudentByEmail(normalizedEmail);
    if (existing) {
      logger.warn(
        { email: normalizedEmail },
        "Student creation failed: email already exists"
      );
      return { error: "Student with this email already exists" };
    }

    // Also prevent using an email already used by a company
    const usedByCompany = await this.emailExistsInCompanies(normalizedEmail);
    if (usedByCompany) {
      // logger.warn(
      //   { email: normalizedEmail },
      //   "Student creation failed: email already in used !"
      // );
      return { error: "This email is already in used !" };
      // throw new Error("This email is already used by a company account");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Trim full name
    const normalizedFullName = fullName.trim();

    // Insert student
    let result;
    try {
      result = await db
        .insert(students)
        .values({
          email: normalizedEmail,
          password: hashedPassword,
          fullName : normalizedFullName,
          role: role || "STUDENT",
          status: status || "Active",
        })
        .returning();

      if (!result || result.length === 0) {
        return { error: "Failed to insert student into database" };
      }

      logger.info(
        { email: normalizedEmail, id: result[0]?.id },
        "Student created successfully"
      );
      return { success: "Student created successfully" };
    } catch (dbError: any) {
      logger.error(
        { email: normalizedEmail, error: dbError },
        "Database error while creating student"
      );
      if (
        dbError &&
        (dbError.code === "23505" || dbError.constraint?.includes("unique"))
      ) {
        return { error: "Student with this email already exists" };
        // throw new Error("Student with this email already exists");
      }
      return { error: "Failed to create student" };
      // throw new Error("Failed to create student in database");
    }

    return result[0];
  }

  /**
   * Update a student
   */
  static async updateStudent(input: UpdateStudentInput) {
    const { id, ...updates } = input;

    const result = await db
      .update(students)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(students.id, id))
      .returning();

    return result[0] ?? null;
  }

  /**
   * Delete a student
   */
  static async deleteStudent(id: number) {
    await db.delete(students).where(eq(students.id, id));
    return { success: true };
  }
}
