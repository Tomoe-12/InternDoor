import { NextResponse } from 'next/server';
import { db } from '../../../db/client';
import { userConnectedAccounts } from '../../../db/schema/user_connected_accounts';
import { students } from '../../../db/schema/students';
import { companies } from '../../../db/schema/companies';
import { eq, and } from 'drizzle-orm';

export const runtime = 'nodejs';

// Get connected accounts for student/company
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const companyId = searchParams.get('companyId');

  if (!studentId && !companyId) {
    return NextResponse.json({ error: 'studentId or companyId required' }, { status: 400 });
  }

  const conditions = [];
  if (studentId) conditions.push(eq(userConnectedAccounts.studentId, parseInt(studentId)));
  if (companyId) conditions.push(eq(userConnectedAccounts.companyId, parseInt(companyId)));

  const rows = await db
    .select()
    .from(userConnectedAccounts)
    .where(conditions.length > 0 ? conditions[0] : undefined);

  return NextResponse.json(rows);
}

// Create connected account (OAuth provider)
export async function POST(request: Request) {
  const data = await request.json();
  const { studentId, companyId, provider, providerId } = data;

  if (!provider || !providerId) {
    return NextResponse.json({ error: 'provider and providerId required' }, { status: 400 });
  }

  if (!studentId && !companyId) {
    return NextResponse.json({ error: 'studentId or companyId required' }, { status: 400 });
  }

  const insert = await db
    .insert(userConnectedAccounts)
    .values({
      studentId: studentId ?? null,
      companyId: companyId ?? null,
      provider,
      providerId,
      connectedAt: new Date(),
    })
    .returning();

  return NextResponse.json(insert[0] ?? null, { status: 201 });
}

// Delete connected account
export async function DELETE(request: Request) {
  const data = await request.json();
  const { id } = data;

  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }

  await db.delete(userConnectedAccounts).where(eq(userConnectedAccounts.id, id));
  return NextResponse.json({ success: true });
}