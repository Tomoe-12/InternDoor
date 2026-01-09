import { NextRequest, NextResponse } from "next/server";
import { StudentService } from "@/server/services/student.service";
import { createStudentSchema, getStudentsSchema } from "@/server/schemas/student.schema";

export const runtime = "nodejs";

/**
 * GET /api/students - Get all students
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");
    const size = searchParams.get("size");

    const params = getStudentsSchema.parse({
      page: page ? Number(page) : 1,
      size: size ? Number(size) : 10,
    });

    const result = await StudentService.getStudents(params);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid query parameters", details: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/students - Create a new student
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createStudentSchema.parse(body);
    const result = await StudentService.createStudent(validatedData);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
