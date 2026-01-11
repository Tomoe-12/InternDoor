"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { loginAction, getCurrentUserAction } from "@/server/actions/auth.actions";
import type { UserResponse } from "@/models/user/UserResponse";

interface AuthProps {
  middleware?: "auth" | "guest";
  redirectIfAuthenticated?: string | ((user: UserResponse) => string | undefined | null);
}

/**
 * Updated auth hook using Next Safe Actions
 * This replaces the old use-auth.ts hook
 */
export const useAuthGuard = ({ middleware, redirectIfAuthenticated }: AuthProps = {}) => {
  const router = useRouter();

  // Login action
  const { execute: executeLogin, result: loginResult } = useAction(loginAction);

  // Get current user action (can be called manually when needed)
  const { execute: executeGetUser, result: userResult } = useAction(getCurrentUserAction);

  // Login function
  const login = async (props: { email: string; password: string }) => {
    executeLogin(props);
  };

  // Store token after successful login
  useEffect(() => {
    if (loginResult?.data?.token && typeof window !== "undefined") {
      localStorage.setItem("auth_token", loginResult.data.token);
    }
  }, [loginResult?.data?.token]);

  // Logout function
  const logout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      window.location.href = "/auth/login?logout=success";
    }
  };

  // Get current user from token
  const getCurrentUser = async () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        executeGetUser({ token });
      }
    }
  };

  // Get user from login result or fetch it
  const rawUser = loginResult?.data?.user || userResult?.data;
  // Normalize role: uppercase and map SUPER_ADMIN -> ADMIN
  const user = rawUser
    ? {
        ...rawUser,
        role:
          typeof rawUser.role === "string"
            ? ((rawUser.role as string).toUpperCase() === "SUPER_ADMIN"
                ? "ADMIN"
                : (rawUser.role as string).toUpperCase())
            : rawUser.role,
      }
    : undefined;

  // Handle redirects
  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user) {
      const redirectPath =
        typeof redirectIfAuthenticated === "function"
          ? redirectIfAuthenticated(user as UserResponse)
          : redirectIfAuthenticated;

      if (redirectPath) {
        router.push(redirectPath);
      }
    }

    if (middleware === "auth" && loginResult?.serverError) {
      logout();
    }
  }, [user, loginResult, redirectIfAuthenticated, router, middleware]);

  return {
    user: user as UserResponse | undefined,
    login,
    logout,
    getCurrentUser,
    isLoading: loginResult?.status === "executing" || userResult?.status === "executing",
    error: loginResult?.serverError || userResult?.serverError,
    fieldErrors: loginResult?.fieldErrors || userResult?.fieldErrors,
  };
};
