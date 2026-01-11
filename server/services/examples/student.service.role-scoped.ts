import { db } from "@/db/client";
import { students } from "@/db/schema/students";
import { eq, and, inArray } from "drizzle-orm";
import { UserResponse, Role } from "@/models/user/UserResponse";
import { hasUniversityAccess, getUserUniversityScope } from "@/lib/auth/role-utils";

/**
 * Example: Student service with role-based data filtering
 * 
 * This demonstrates how to properly scope data access based on user role:
 * - ADMIN (Super Admin): Access to ALL students
 * - UNIVERSITY_ADMIN: Access to ONLY their university's students
 */

export class StudentServiceExample {
  /**
   * Get students with role-based filtering
   */
  static async getStudents(user: UserResponse, page = 1, pageSize = 10) {
    let query = db.select().from(students);
    
    // Apply role-based filtering
    if (user.role === Role.UNIVERSITY_ADMIN && user.universityId) {
      // University admin can only see their university's students
      query = query.where(eq(students.universityId, user.universityId));
    }
    // Super admin (Role.ADMIN) has no filter - sees all students
    
    const offset = (page - 1) * pageSize;
    const results = await query.limit(pageSize).offset(offset);
    
    return results;
  }

  /**
   * Get single student with access verification
   */
  static async getStudentById(user: UserResponse, studentId: number) {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);
    
    if (!student) {
      throw new Error("Student not found");
    }
    
    // Verify university admin has access to this student
    if (user.role === Role.UNIVERSITY_ADMIN) {
      if (!hasUniversityAccess(user, student.universityId || "")) {
        throw new Error("Access denied: This student belongs to a different university");
      }
    }
    
    return student;
  }

  /**
   * Update student with access verification
   */
  static async updateStudent(
    user: UserResponse,
    studentId: number,
    data: Partial<typeof students.$inferInsert>
  ) {
    // First, verify access
    const student = await this.getStudentById(user, studentId);
    
    // University admins cannot change the university assignment
    if (user.role === Role.UNIVERSITY_ADMIN && data.universityId) {
      if (data.universityId !== user.universityId) {
        throw new Error("Access denied: You cannot transfer students to other universities");
      }
    }
    
    // Perform update
    const [updated] = await db
      .update(students)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(students.id, studentId))
      .returning();
    
    return updated;
  }

  /**
   * Delete student with access verification
   */
  static async deleteStudent(user: UserResponse, studentId: number) {
    // Verify access before deletion
    await this.getStudentById(user, studentId);
    
    await db.delete(students).where(eq(students.id, studentId));
    
    return { success: true };
  }

  /**
   * Get students by multiple university IDs (for super admin)
   */
  static async getStudentsByUniversities(
    user: UserResponse,
    universityIds: string[]
  ) {
    // Get user's allowed universities
    const allowedUniversities = getUserUniversityScope(user);
    
    // If null (super admin), allow requested universities
    // If array (university admin), filter to only their university
    const scopedUniversityIds =
      allowedUniversities === null
        ? universityIds
        : universityIds.filter((id) => allowedUniversities.includes(id));
    
    if (scopedUniversityIds.length === 0) {
      return [];
    }
    
    const results = await db
      .select()
      .from(students)
      .where(inArray(students.universityId, scopedUniversityIds));
    
    return results;
  }

  /**
   * Get statistics scoped to user's access
   */
  static async getStudentStats(user: UserResponse) {
    let query = db.select().from(students);
    
    // Apply university scope for university admin
    if (user.role === Role.UNIVERSITY_ADMIN && user.universityId) {
      query = query.where(eq(students.universityId, user.universityId));
    }
    
    const allStudents = await query;
    
    return {
      total: allStudents.length,
      verified: allStudents.filter((s) => s.verified).length,
      unverified: allStudents.filter((s) => !s.verified).length,
      active: allStudents.filter((s) => s.status === "Active").length,
      // Can only see stats for accessible students
      scope: user.role === Role.ADMIN ? "all" : user.universityId,
    };
  }
}

/**
 * Usage examples:
 * 
 * // In API route or server action:
 * import { getCurrentUser } from "@/lib/auth/session";
 * 
 * export async function GET(request: Request) {
 *   const user = await getCurrentUser();
 *   
 *   // Automatically filtered based on user role
 *   const students = await StudentServiceExample.getStudents(user);
 *   
 *   return Response.json(students);
 * }
 * 
 * // Super admin sees all students
 * // University admin sees only their university's students
 */
