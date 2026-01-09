import { NextResponse } from 'next/server';
import { db } from '../../../db/client';
import { profiles } from '../../../db/schema/profiles';

export const runtime = 'nodejs';

export async function GET() {
  const rows = await db.select().from(profiles).limit(5);
  return NextResponse.json({ ok: true, count: rows.length, sample: rows });
}
