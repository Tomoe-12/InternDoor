import useSWR from "swr";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import httpClient, { restClient } from "../httpClient";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import { UserResponse } from "@/models/user/UserResponse";
import { LoginRequest } from "@/models/backend";

interface AuthProps {
  middleware?: "auth" | "guest";
  redirectIfAuthenticated?:
    | string
    | ((user: UserResponse) => string | undefined | null);
}


export const useAuthGuard = ({
  middleware,
  redirectIfAuthenticated,
}: AuthProps = {}) => {
  const router = useRouter();

  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/auth/me", async () => {
    // Use direct fetch to Next.js API route and include JWT from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    const res = await fetch("/api/auth/me", {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) {
      throw new Error("Unauthorized");
    }
    return (await res.json()) as UserResponse;
  });

  const login = async ({
    onError,
    props,
  }: {
    onError: (errors: HttpErrorResponse | undefined) => void;
    props: LoginRequest;
  }) => {
    onError(undefined);

    try {
      // Call Next.js API route directly to avoid BASE_URL coupling
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.token && data?.user) {
        const token = data.token as string;
        const userFromLogin = data.user as UserResponse;

        if (typeof window !== "undefined" && token) {
          localStorage.setItem("auth_token", token);
        }

        // Normalize role to uppercase string and map SUPER_ADMIN -> ADMIN
        try {
          if (userFromLogin.role && typeof userFromLogin.role === "string") {
            const normalized = (userFromLogin.role as string).toUpperCase();
            (userFromLogin as any).role = normalized === "SUPER_ADMIN" ? "ADMIN" : normalized;
          }
        } catch {}

        // Prime SWR cache immediately so callers have user data for redirects
        await mutate(userFromLogin, { revalidate: false });
        // Revalidate in background to sync with /api/auth/me
        mutate().catch(() => undefined);
        return userFromLogin;
      }

      // Handle email verification required responses (403)
      if (res.status === 403 && data?.requiresEmailVerification) {
        return data;
      }

      // Other errors: pass message to onError
      const errors: HttpErrorResponse | undefined = {
        message: (data?.error as string) || (data?.message as string) || "Login failed",
      } as any;
      onError(errors);
      throw new Error(errors.message || "Login failed");
    } catch (err: any) {
      const errors = err?.response?.data as HttpErrorResponse | undefined;
      onError(errors);
      throw err;
    }
  };

  // const csrf = async () => {
  //   await restClient.csrf();
  // };

  const logout = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }).catch(() => undefined);
    } finally {
      // Clear the stored token
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
      // Refresh user state
      await mutate(undefined, { revalidate: true }).catch(() => undefined);
      // Redirect with a flag to display a logout success toast on the login page
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login?logout=success";
      }
    }
  };

  useEffect(() => {
    // If middleware is 'guest' and we have a user, redirect
    if (middleware === "guest" && redirectIfAuthenticated && user) {
      const redirectPath =
        typeof redirectIfAuthenticated === "function"
          ? redirectIfAuthenticated(user)
          : redirectIfAuthenticated;

      if (redirectPath) {
        router.push(redirectPath);
      }
    }

    // If middleware is 'auth' and we have an error, logout
    if (middleware === "auth" && error) {
      logout();
    }
  }, [user, error, redirectIfAuthenticated, router]);

  return {
    user,
    login,
    logout,
    mutate,
  };
};
