import { NextResponse } from 'next/server';
import { db } from '../../../db/client';
import { verificationCodes } from '../../../db/schema/verification_codes';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const data = await request.json();
  const insert = await db.insert(verificationCodes).values({
    studentId: data.studentId ?? null,
    companyId: data.companyId ?? null,
    code: data.code,
    expiresAt: new Date(data.expiresAt),
  }).returning();
  return NextResponse.json(insert[0] ?? null, { status: 201 });
}