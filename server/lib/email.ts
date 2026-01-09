/**
 * Email service for sending transactional emails via Resend
 */

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}

interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Send an email using Resend API
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailParams): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com";

  if (!apiKey) {
    return {
      success: false,
      error: "RESEND_API_KEY is not configured",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: Array.isArray(to) ? to : [to],
        subject,
        html: html || text,
        text: text || undefined,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend API error:", errorText);
      return {
        success: false,
        error: "Failed to send email",
      };
    }

    const result = await response.json();
    return {
      success: true,
      id: result.id,
    };
  } catch (error) {
    console.error("Email service error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send a verification code email
 */
export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<EmailResult> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify Your Email</h2>
      <p>Your verification code is:</p>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">
        ${code}
      </div>
      <p>This code expires in 15 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Verify your email",
    html,
  });
}

/**
 * Send a password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
): Promise<EmailResult> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>Click the link below to reset your password:</p>
      <div style="margin: 20px 0;">
        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Reset your password",
    html,
  });
}

/**
 * Send a company welcome email
 */
export async function sendCompanyWelcomeEmail(
  email: string,
  companyName: string
): Promise<EmailResult> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to InternDoor, ${companyName}!</h2>
      <p>Thank you for registering with InternDoor. Your company account has been successfully created.</p>
      <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid #007bff;">
        <h3>What's Next?</h3>
        <ul>
          <li>Complete your company profile</li>
          <li>Post your first internship opportunity</li>
          <li>Start connecting with talented students</li>
        </ul>
      </div>
      <div style="margin: 20px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://interndoor.com"}/company/onboarding" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Complete Your Profile
        </a>
      </div>
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Best regards,<br>The InternDoor Team</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Welcome to InternDoor, ${companyName}!`,
    html,
  });
}
