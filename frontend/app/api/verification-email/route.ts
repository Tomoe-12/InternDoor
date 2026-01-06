import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { db } from '../../../db/client';
import { verificationCodes } from '../../../db/schema/verification_codes';
import crypto from 'crypto';

export const runtime = 'nodejs';

// Send verification email via Supabase (placeholder for email service)
export async function POST(request: Request) {
  const data = await request.json();
  const { email, studentId, companyId } = data;

  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 });
  }

  if (!studentId && !companyId) {
    return NextResponse.json({ error: 'studentId or companyId required' }, { status: 400 });
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  try {
    // Store verification code
    const stored = await db
      .insert(verificationCodes)
      .values({
        studentId: studentId ?? null,
        companyId: companyId ?? null,
        code,
        expiresAt,
        emailSent: false,
      })
      .returning();

    // Send email via Resend (or Supabase email service)
    // For now, this is a placeholder
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'noreply@yourdomain.com',
        to: email,
        subject: 'Verify your email',
        html: `<p>Your verification code is: <strong>${code}</strong></p><p>This code expires in 15 minutes.</p>`,
      }),
    });

    if (!emailResponse.ok) {
      console.error('Email send failed:', await emailResponse.text());
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // Mark as sent
    await db.update(verificationCodes).set({ emailSent: true });

    return NextResponse.json({
      success: true,
      codeId: stored[0]?.id,
      expiresAt,
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Verify code
export async function PUT(request: Request) {
  const data = await request.json();
  const { code } = data;

  if (!code) {
    return NextResponse.json({ error: 'code required' }, { status: 400 });
  }

  const record = await db
    .select()
    .from(verificationCodes)
    .where((t) => t.code === code)
    .limit(1);

  if (!record || record.length === 0) {
    return NextResponse.json({ error: 'code not found' }, { status: 404 });
  }

  const entry = record[0];
  if (new Date() > entry.expiresAt) {
    return NextResponse.json({ error: 'code expired' }, { status: 401 });
  }

  return NextResponse.json({ valid: true, studentId: entry.studentId, companyId: entry.companyId });
}