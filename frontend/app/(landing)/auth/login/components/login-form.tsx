"use client";

import type React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Building2, GraduationCap, Eye, EyeOff, DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import ModeToggle from "@/components/ModeToggle";
import { useAuthGuard } from "@/lib/auth/use-auth";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import { Role } from "@/models/user/UserResponse";
import { loginSchema } from "@/types/login-schema";

type UserRole = "company" | "student";
type LoginFormValues = z.infer<typeof loginSchema>;

interface RoleOption {
  id: UserRole;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const roles: RoleOption[] = [
  {
    id: "student",
    label: "Student",
    icon: <GraduationCap className="h-5 w-5" />,
    description: "Find internship opportunities",
  },
  {
    id: "company",
    label: "Company",
    icon: <Building2 className="h-5 w-5" />,
    description: "Post internships & find talent",
  },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<
    "google" | "github" | null
  >(null);
  const { login } = useAuthGuard({
    middleware: "guest",
    redirectIfAuthenticated: (user) => {
      if (user.role === Role.ADMIN) return "/admin";
      if (user.role === Role.COMPANY) return "/company/dashboard";
      return "/profile";
    },
  });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Check for verification success or error
  useEffect(() => {
    const verified = searchParams.get("verified");
    const error = searchParams.get("error");
    const logout = searchParams.get("logout");

    if (verified === "true") {
      toast.success("Email verified successfully! You can now log in.");
    } else if (error) {
      toast.error(error);
    } else if (logout === "success") {
      toast.success("You have been logged out.");
    }
  }, [searchParams]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const userData = await login({
        onError: (errors) => {
          const errorMessage =
            (errors as any)?.message || (errors as any)?.generalErrors?.[0];
          if (errorMessage) toast.error(errorMessage);
        },
        props: { email: values.email.trim(), password: values.password },
      });

      toast.success("Login successful! Redirecting...");

      // Redirect based on user role
      if (userData) {
        const role = userData.role;
        if (role === Role.ADMIN) {
          router.push("/admin");
        } else if (role === Role.COMPANY) {
          const needsSetup = userData.profileComplete === false;
          router.push(
            needsSetup ? "/company/onboarding" : "/company/dashboard"
          );
        } else {
          router.push("/profile");
        }
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data as any;
      if (status === 403 && data?.reason) {
        if (data.reason === "verification_pending") {
          toast.error("Please verify your email to continue.");
        } else if (
          data.reason === "verification_expired" ||
          data.reason === "verification_sent"
        ) {
          toast.error(
            "Your verification code was expired. We sent a new verification email."
          );
        } else {
          toast.error(
            data?.message ?? "Login blocked. Please verify your email."
          );
        }
        return;
      }

      const serverError = data as HttpErrorResponse | undefined;
      const errorMessage =
        serverError?.message ||
        serverError?.generalErrors?.[0] ||
        "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      // react-hook-form manages isSubmitting; no manual state needed here
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    if (!baseUrl) {
      toast.error("NEXT_PUBLIC_BASE_URL is not configured.");
      return;
    }

    setIsOAuthLoading(provider);
    const oauthUrl = `${baseUrl}/oauth2/authorization/${provider}`;
    window.location.href = oauthUrl;
  };

  const heroContent = {
    student: {
      // public/ is served at the site root; use absolute path from public
      image: "/images/student-studying-laptop-library.jpg",
      title: "Launch your career with the perfect internship",
      description:
        "Connect with top companies offering internships that match your skills and career goals. Your next opportunity is just a click away.",
    },
    company: {
      image: "/images/modern-office-team-collaboration.jpg",
      title: "Find exceptional talent for your team",
      description:
        "Access a pool of motivated students ready to bring fresh perspectives and energy to your organization. Build your future workforce today.",
    },
  };

  const currentHero = heroContent[selectedRole];

  return (
    <div className="min-h-screen flex">
      <div className="absolute right-4 top-4 z-50">
        <ModeToggle />
      </div>
      {/* Left Side - Visual Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${currentHero.image})` }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-bold"
            >
              <DoorOpen className="h-8 w-8" />
              InternDoor
            </Link>
          </div>
          <div className="space-y-4 max-w-md">
            <h1 className="text-4xl font-bold leading-tight text-balance">
              {currentHero.title}
            </h1>
            <p className="text-lg text-primary-foreground/80 text-pretty leading-relaxed">
              {currentHero.description}
            </p>
          </div>
          <div className="text-sm text-primary-foreground/60">
            © 2025 InternDoor. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-bold text-primary"
            >
              <DoorOpen className="h-7 w-7" />
              InternDoor
            </Link>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-balance">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-pretty">
              Sign in to your account to continue
            </p>
          </div>

          <div className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                I am signing in as a
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:border-primary/50",
                      selectedRole === role.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-full p-2.5 transition-colors",
                        selectedRole === role.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {role.icon}
                    </div>
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        selectedRole === role.id
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {role.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          disabled={isSubmitting || isOAuthLoading !== null}
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium">
                          Password
                        </FormLabel>
                        <Link
                          href="/auth/forgot-password"
                          className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={isSubmitting || isOAuthLoading !== null}
                            className="pr-10 h-11"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-11 font-medium"
                  disabled={isSubmitting || isOAuthLoading !== null}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>

            <div className="space-y-4">
              {selectedRole === "company" && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-3 text-muted-foreground font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  {/* <div className="grid grid-cols-2 gap-3"> */}
                    <div className="grid grid-cols-1 gap-3">
                    <Button
                      variant="outline"
                      type="button"
                      disabled={isOAuthLoading !== null || isSubmitting}
                      onClick={() => handleOAuthLogin("google")}
                      className="gap-2 h-11"
                    >
                      {isOAuthLoading === "google" ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <FcGoogle className="h-4 w-4" />
                      )}
                      Google
                    </Button>
                    {/* <Button
                      variant="outline"
                      type="button"
                      disabled={isOAuthLoading !== null || isLoading}
                      onClick={() => handleOAuthLogin("github")}
                      className="gap-2 h-11"
                    >
                      {isOAuthLoading === "github" ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      )}
                      GitHub
                    </Button> */}
                  </div>
                </>
              )}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
