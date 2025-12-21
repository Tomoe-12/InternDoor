import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/auth/login?error=Invalid verification token", request.url)
    );
  }

  try {
    // Call the backend API to verify the email
    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";
    const response = await fetch(
      `${backendUrl}/api/users/verify-email?token=${token}`,
      {
        method: "GET",
      }
    );

    if (response.ok) {
      // Redirect to login page with success message
      return NextResponse.redirect(
        new URL("/auth/login?verified=true", request.url)
      );
    } else {
      // Redirect to login page with error
      return NextResponse.redirect(
        new URL("/auth/login?error=Verification failed", request.url)
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(
      new URL("/auth/login?error=Verification failed", request.url)
    );
  }
}
