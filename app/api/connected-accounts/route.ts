import { NextRequest, NextResponse } from "next/server";
import { ConnectedAccountService } from "@/server/services/connected-account.service";
import {
  getConnectedAccountsSchema,
  createConnectedAccountSchema,
  deleteConnectedAccountSchema,
} from "@/server/schemas/connected-account.schema";

export const runtime = "nodejs";

/**
 * GET /api/connected-accounts - Get connected accounts
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get("studentId");
    const companyId = searchParams.get("companyId");

    const params = getConnectedAccountsSchema.parse({
      studentId: studentId ? Number(studentId) : undefined,
      companyId: companyId ? Number(companyId) : undefined,
    });

    const result = await ConnectedAccountService.getConnectedAccounts(params);
    return NextResponse.json(result);
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

/**
 * POST /api/connected-accounts - Create connected account
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createConnectedAccountSchema.parse(body);
    const result = await ConnectedAccountService.createConnectedAccount(validatedData);
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

/**
 * DELETE /api/connected-accounts - Delete connected account
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = deleteConnectedAccountSchema.parse(body);
    const result = await ConnectedAccountService.deleteConnectedAccount(validatedData);
    return NextResponse.json(result);
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
