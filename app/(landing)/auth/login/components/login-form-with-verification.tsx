/**
 * FRONTEND: Login Form with Email Verification Logic
 * 
 * This component implements your exact requirements:
 * - If token expired: auto-resend + show "Email resent! Verify again"
 * - If token valid: show "Please verify your email"
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface VerificationError {
  requiresEmailVerification: true;
  verificationStatus: 'expired' | 'pending';
  verificationMessage: string;
  expiresAt?: Date;
}

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export function LoginFormWithEmailVerification({ onLoginSuccess }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationError, setVerificationError] = useState<VerificationError | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setVerificationError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // ✅ LOGIN SUCCESSFUL
        localStorage.setItem('auth_token', data.token);
        toast.success('Login successful! Redirecting...');
        onLoginSuccess?.();
        router.push('/dashboard');
        return;
      }

      if (data.requiresEmailVerification) {
        // ❌ EMAIL NOT VERIFIED
        setVerificationError({
          requiresEmailVerification: true,
          verificationStatus: data.verificationStatus,
          verificationMessage: data.verificationMessage,
          expiresAt: data.expiresAt,
        });

        // Show different toast based on token status
        if (data.verificationStatus === 'expired') {
          // STATE 1: Token EXPIRED → Auto-resent
          toast.info('✉️ Email Resent!', {
            description: data.verificationMessage,
            // "Your verification link expired. We've resent it to your email. Please check your inbox."
            duration: 5000,
          });
        } else if (data.verificationStatus === 'pending') {
          // STATE 2: Token VALID → Just remind
          toast.warning('⏳ Please Verify Your Email', {
            description: data.verificationMessage,
            // "Please verify your email. Your verification link expires in X minutes."
            duration: 5000,
          });
        }

        return;
      }

      // ❌ OTHER ERROR
      toast.error('Login Failed', {
        description: data.message || 'Invalid email or password',
      });
    } catch (error) {
      toast.error('Login Error', {
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full space-y-4">
      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          className="w-full px-4 py-2 border rounded-lg"
          required
          disabled={isLoading}
        />
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-2 border rounded-lg"
          required
          disabled={isLoading}
        />
      </div>

      {/* Verification Error Message */}
      {verificationError && (
        <div className="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50">
          <div className="flex items-start gap-3">
            {verificationError.verificationStatus === 'expired' ? (
              // STATE 1: Token Expired (Auto-resent)
              <>
                <span className="text-2xl">✉️</span>
                <div>
                  <h3 className="font-semibold text-yellow-900">Email Resent!</h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    {verificationError.verificationMessage}
                  </p>
                  <p className="text-xs text-yellow-700 mt-2">
                    New verification link expires in 1 hour
                  </p>
                </div>
              </>
            ) : (
              // STATE 2: Token Valid (Not Expired)
              <>
                <span className="text-2xl">⏳</span>
                <div>
                  <h3 className="font-semibold text-yellow-900">Verify Your Email</h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    {verificationError.verificationMessage}
                  </p>
                  <p className="text-xs text-yellow-700 mt-2">
                    Check your inbox for the verification link
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Login Button */}
      <button
        type="submit"
        disabled={isLoading || verificationError !== null}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      {/* Help Text */}
      {verificationError && (
        <div className="text-center text-sm text-gray-600">
          <p>
            Didn't receive the email?{' '}
            <button
              type="button"
              onClick={() => handleResendEmail(email)}
              className="text-blue-600 hover:underline"
            >
              Request new email
            </button>
          </p>
        </div>
      )}
    </form>
  );
}

/**
 * Helper function to manually resend verification email
 */
async function handleResendEmail(email: string) {
  try {
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      toast.success('✉️ Email Resent!', {
        description: 'Check your inbox for the verification link.',
      });
    } else {
      toast.error('Failed to resend email');
    }
  } catch (error) {
    toast.error('Error resending email');
  }
}

/**
 * FLOW VISUALIZATION:
 * 
 * LOGIN ATTEMPT
 *       ↓
 * [Enter email + password]
 *       ↓
 * ┌─────────────────────────────┐
 * │ EMAIL VERIFIED?             │
 * └──────────┬──────────────────┘
 *       YES  │  NO
 *            │
 *     ┌──────┴────────┐
 *     ↓               ↓
 *  ✅ LOGIN      CHECK TOKEN
 *   SUCCESS      STATUS
 *                     ↓
 *          ┌──────────┴──────────┐
 *          │                     │
 *       EXPIRED              NOT EXPIRED
 *          │                     │
 *          ↓                     ↓
 *     STATE 1:              STATE 2:
 *   ✉️ AUTO-RESEND        ⏳ REMINDER
 *   "Email resent!        "Please verify
 *    Verify again"         your email"
 *    (1 hour timer)       (X mins left)
 *          │                     │
 *          └──────────┬──────────┘
 *                     ↓
 *           ❌ LOGIN BLOCKED
 *           Show error message
 *           User must verify
 */
