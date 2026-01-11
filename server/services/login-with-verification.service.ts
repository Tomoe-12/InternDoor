import { EmailVerificationService } from "@/server/services/email-verification.service";
import { AuthService } from "@/server/services/auth.service";

/**
 * LOGIN ENDPOINT WITH EMAIL VERIFICATION CHECK
 * 
 * Flow:
 * 1. User provides email + password
 * 2. Verify credentials
 * 3. Check if email is verified
 * 4. If not verified:
 *    - If token expired → auto-resend + show message
 *    - If token valid → show message to verify
 */

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: any;
  requiresEmailVerification?: boolean;
  verificationStatus?: "verified" | "expired" | "pending";
  verificationMessage?: string;
  expiresAt?: Date;
}

export async function loginHandler(req: LoginRequest): Promise<LoginResponse> {
  const { email, password } = req;

  try {
    // Step 1: Authenticate user (verify email and password)
    const loginResult = await AuthService.login({ email, password });

    // Step 2: Check email verification status
    const verificationStatus = await EmailVerificationService.checkVerificationStatus(
      loginResult.user.id,
      loginResult.user.type
    );

    // Step 3: Handle based on verification status
    if (verificationStatus.status === "verified") {
      // ✅ Email is verified, allow full login
      return {
        success: true,
        message: "Login successful",
        token: loginResult.token,
        user: loginResult.user,
        requiresEmailVerification: false,
      };
    }

    // ❌ Email NOT verified, block login but return partial response
    if (verificationStatus.status === "expired") {
      // STATE 1: Token EXPIRED
      // ✅ Auto-resent, show "check email" message
      return {
        success: false,
        requiresEmailVerification: true,
        verificationStatus: "expired",
        verificationMessage: verificationStatus.message,
        // "Your verification link expired. We've resent it to your email. Please check your inbox."
        expiresAt: verificationStatus.expiresAt,
        message:
          "Please verify your email before logging in. New verification email sent.",
      };
    }

    if (verificationStatus.status === "pending") {
      // STATE 2: Token VALID (not expired)
      // ❌ Don't resend, just remind
      return {
        success: false,
        requiresEmailVerification: true,
        verificationStatus: "pending",
        verificationMessage: verificationStatus.message,
        // "Please verify your email. Your verification link expires in X minutes."
        expiresAt: verificationStatus.expiresAt,
        message: "Please verify your email before logging in.",
      };
    }

    throw new Error("Unknown verification status");
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Login failed",
    };
  }
}

/**
 * FRONTEND USAGE:
 * 
 * // In your login component
 * const handleLogin = async (email, password) => {
 *   const response = await loginHandler({ email, password });
 *   
 *   if (response.success) {
 *     // ✅ Login successful
 *     localStorage.setItem('token', response.token);
 *     router.push('/dashboard');
 *   } else if (response.requiresEmailVerification) {
 *     // ❌ Email not verified
 *     
 *     if (response.verificationStatus === 'expired') {
 *       // STATE 1: Token expired, auto-resent
 *       showToast({
 *         type: 'info',
 *         message: '✉️ Email resent!',
 *         description: response.verificationMessage,
 *         // "Your verification link expired. We've resent it to your email. Please check your inbox."
 *       });
 *     } else if (response.verificationStatus === 'pending') {
 *       // STATE 2: Token still valid
 *       showToast({
 *         type: 'warning',
 *         message: '⏳ Verify your email',
 *         description: response.verificationMessage,
 *         // "Please verify your email. Your verification link expires in X minutes."
 *       });
 *     }
 *   } else {
 *     // ❌ Other error (invalid credentials, etc)
 *     showToast({
 *       type: 'error',
 *       message: 'Login failed',
 *       description: response.message,
 *     });
 *   }
 * };
 */
