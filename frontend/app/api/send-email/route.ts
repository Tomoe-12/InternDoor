import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export const runtime = 'nodejs';

// Simple transactional email service
// Sends emails via configured provider (Resend, SendGrid, etc.)
export async function POST(request: Request) {
  const data = await request.json();
  const { to, subject, html, text } = data;

  if (!to || !subject) {
    return NextResponse.json({ error: 'to and subject required' }, { status: 400 });
  }

  try {
    // Using Resend for transactional emails
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com',
        to,
        subject,
        html: html || text,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Resend error:', err);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Email service error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}