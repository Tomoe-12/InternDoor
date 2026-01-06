import { NextResponse } from 'next/server';
import { db } from '../../../db/client';
import { students } from '../../../db/schema/students';

export const runtime = 'nodejs';

export async function GET() {
  const rows = await db.select().from(students).limit(100);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const data = await request.json();
  const insert = await db.insert(students).values({
    email: data.email,
    fullName: data.fullName,
    role: data.role ?? 'STUDENT',
    status: data.status ?? 'Active',
  }).returning();
  return NextResponse.json(insert[0] ?? null, { status: 201 });
}