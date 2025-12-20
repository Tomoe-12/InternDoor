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
  } = useSWR("/api/auth/me", () =>
    httpClient.get<UserResponse>("/api/auth/me").then((res) => res.data)
  );

  const login = async ({
    onError,
    props,
  }: {
    onError: (errors: HttpErrorResponse | undefined) => void;
    props: LoginRequest;
  }) => {
    onError(undefined);

    try {
      const loginRes = await restClient.login(props);
      // Persist token defensively in case interceptors don't run
      if (typeof window !== "undefined" && (loginRes as any)?.token) {
        localStorage.setItem("auth_token", (loginRes as any).token);
      }
      await mutate();
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
    if (!error) {
      await restClient.logout().then(() => mutate());
    }

    // Clear the stored token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }

    window.location.pathname = "/auth/login";
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
