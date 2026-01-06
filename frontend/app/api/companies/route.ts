import { NextResponse } from 'next/server';
import { db } from '../../../db/client';
import { companies } from '../../../db/schema/companies';

export const runtime = 'nodejs';

export async function GET() {
  const rows = await db.select().from(companies).limit(100);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const data = await request.json();
  const insert = await db.insert(companies).values({
    companyName: data.companyName,
    companyEmail: data.companyEmail,
    password: data.password,
  }).returning();
  return NextResponse.json(insert[0] ?? null, { status: 201 });
}