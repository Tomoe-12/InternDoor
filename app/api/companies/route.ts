import { NextRequest, NextResponse } from "next/server";
import { CompanyService } from "@/server/services/company.service";
import { createCompanySchema, getCompaniesSchema } from "@/server/schemas/company.schema";

export const runtime = "nodejs";

/**
 * GET /api/companies - Get all companies
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");
    const size = searchParams.get("size");

    const params = getCompaniesSchema.parse({
      page: page ? Number(page) : 1,
      size: size ? Number(size) : 10,
    });

    const result = await CompanyService.getCompanies(params);
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
 * POST /api/companies - Create a new company
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCompanySchema.parse(body);
    const result = await CompanyService.createCompany(validatedData);
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
