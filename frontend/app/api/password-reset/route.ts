import { NextResponse } from 'next/server';
import { db } from '../../../db/client';
import { passwordResetTokens } from '../../../db/schema/password_reset_tokens';
import { students } from '../../../db/schema/students';
import { companies } from '../../../db/schema/companies';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export const runtime = 'nodejs';

// Create password reset token
export async function POST(request: Request) {
  const data = await request.json();
  const { studentId, companyId } = data;

  if (!studentId && !companyId) {
    return NextResponse.json({ error: 'studentId or companyId required' }, { status: 400 });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  const insert = await db
    .insert(passwordResetTokens)
    .values({
      studentId: studentId ?? null,
      companyId: companyId ?? null,
      token,
      expiresAt,
    })
    .returning();

  return NextResponse.json(insert[0] ?? null, { status: 201 });
}

// Verify and consume token
export async function PUT(request: Request) {
  const data = await request.json();
  const { token } = data;

  if (!token) {
    return NextResponse.json({ error: 'token required' }, { status: 400 });
  }

  const record = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .limit(1);

  if (!record || record.length === 0) {
    return NextResponse.json({ error: 'token not found' }, { status: 404 });
  }

  const entry = record[0];
  if (!entry.expiresAt || new Date() > entry.expiresAt) {
    return NextResponse.json({ error: 'token expired' }, { status: 401 });
  }

  return NextResponse.json({ valid: true, studentId: entry.studentId, companyId: entry.companyId });
}