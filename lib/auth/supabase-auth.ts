"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { supabase } from "@/lib/supabase";
import { UserResponse } from "@/models/user/UserResponse";
import { LoginRequest } from "@/models/backend";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";

export interface AuthProps {
  middleware?: "auth" | "guest";
  redirectIfAuthenticated?:
    | string
    | ((user: UserResponse) => string | undefined | null);
}

export const useSupabaseAuth = ({
  middleware,
  redirectIfAuthenticated,
}: AuthProps = {}) => {
  const router = useRouter();
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Fetch user from database based on authenticated email
  const {
    data: user,
    error,
    mutate,
  } = useSWR(
    "auth/user", // Key for caching
    async () => {
      // Get Supabase auth session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.email) {
        setIsLoadingAuth(false);
        return null;
      }

      // Query students or companies table by email
      const email = session.user.email;

      // Try students table first
      const { data: studentData } = await supabase
        .from("students")
        .select("*")
        .eq("email", email)
        .single();

      if (studentData) {
        setIsLoadingAuth(false);
        return {
          ...studentData,
          connectedAccounts: [],
          authorities: [studentData.role || "STUDENT"],
          authId: session.user.id,
        } as unknown as UserResponse;
      }

      // Try companies table
      const { data: companyData } = await supabase
        .from("companies")
        .select("*")
        .eq("companyEmail", email)
        .single();

      if (companyData) {
        setIsLoadingAuth(false);
        return {
          id: companyData.id,
          email: companyData.companyEmail,
          fullName: companyData.companyName,
          role: (companyData.role || "COMPANY") as any,
          verified: true,
          status: companyData.status || "Active",
          connectedAccounts: [],
          authorities: [companyData.role || "COMPANY"],
          authId: session.user.id,
        } as unknown as UserResponse;
      }

      setIsLoadingAuth(false);
      return null;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
    }
  );

  const login = async ({
    onError,
    props,
  }: {
    onError: (errors: HttpErrorResponse | undefined) => void;
    props: LoginRequest;
  }) => {
    onError(undefined);
    setIsLoadingAuth(true);

    try {
      const { email, password } = props;

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        const errors: HttpErrorResponse = {
          message: signInError.message || "Login failed",
        } as any;
        onError(errors);
        setIsLoadingAuth(false);
        throw new Error(signInError.message);
      }

      if (!data.user) {
        const errors: HttpErrorResponse = {
          message: "Login failed: no user returned",
        } as any;
        onError(errors);
        setIsLoadingAuth(false);
        throw new Error("No user returned from Supabase");
      }

      // Fetch user profile from domain table
      const domainUser = await mutate();

      setIsLoadingAuth(false);
      return domainUser || data.user;
    } catch (err: any) {
      setIsLoadingAuth(false);
      const errors: HttpErrorResponse = {
        message: err?.message || "Login failed",
      } as any;
      onError(errors);
      throw err;
    }
  };

  const signup = async (
    email: string,
    password: string,
    domainData?: any
  ) => {
    setIsLoadingAuth(true);

    try {
      // Create Supabase auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setIsLoadingAuth(false);
        throw new Error(error.message);
      }

      if (!data.user) {
        setIsLoadingAuth(false);
        throw new Error("Signup failed: no user returned");
      }

      // Refresh user state
      await mutate();
      setIsLoadingAuth(false);

      return {
        success: true,
        user: data.user,
        requiresEmailVerification: !data.session,
      };
    } catch (err: any) {
      setIsLoadingAuth(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setIsLoadingAuth(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
      }

      // Clear user state
      await mutate(null);
      setIsLoadingAuth(false);

      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login?logout=success";
      }
    } catch (err) {
      console.error("Logout error:", err);
      setIsLoadingAuth(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (err: any) {
      throw new Error(err?.message || "Password reset failed");
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (err: any) {
      throw new Error(err?.message || "Password update failed");
    }
  };

  // Auto-logout on auth state change
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        mutate(null);
      } else if (event === "SIGNED_IN") {
        mutate();
      }
    });

    return () => subscription?.unsubscribe();
  }, [mutate]);

  // Handle middleware redirects
  useEffect(() => {
    if (isLoadingAuth) return;

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

    // If middleware is 'auth' and we don't have a user, logout
    if (middleware === "auth" && error && !user) {
      logout();
    }
  }, [user, error, isLoadingAuth, middleware, redirectIfAuthenticated, router]);

  return {
    user,
    login,
    signup,
    logout,
    resetPassword,
    updatePassword,
    mutate,
    isLoading: isLoadingAuth,
    error,
  };
};
