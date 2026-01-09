import { actionClient, z } from "@/server/config/action";
import { createStudentSchema, getStudentsSchema, updateStudentSchema } from "@/server/schemas/student.schema";
import { StudentService } from "@/server/services/student.service";

/**
 * Get all students with pagination
 */
export const getStudentsAction = actionClient
  .schema(getStudentsSchema)
  .action(async ({ parsedInput }) => {
    const result = await StudentService.getStudents(parsedInput);
    return result;
  });

/**
 * Get a student by ID
 */
export const getStudentByIdAction = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput }) => {
    const student = await StudentService.getStudentById(parsedInput.id);
    if (!student) {
      throw new Error("Student not found");
    }
    return student;
  });

/**
 * Create a new student
 */
export const createStudentAction = actionClient
  .schema(createStudentSchema)
  .action(async ({ parsedInput }) => {
    const result = await StudentService.createStudent(parsedInput);
    
    // Check if service returned an error
    if (result && 'error' in result) {
      throw new Error(result.error);
    }
    
    return result;
  });

/**
 * Update a student
 */
export const updateStudentAction = actionClient
  .schema(updateStudentSchema)
  .action(async ({ parsedInput }) => {
    const student = await StudentService.updateStudent(parsedInput);
    if (!student) {
      throw new Error("Student not found");
    }
    return student;
  });

/**
 * Delete a student
 */
export const deleteStudentAction = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput }) => {
    await StudentService.deleteStudent(parsedInput.id);
    return { success: true };
  });
