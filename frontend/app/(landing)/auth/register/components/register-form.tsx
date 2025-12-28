"use client";

import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import Link from "next/link";
import { toast } from "sonner";
import ModeToggle from "@/components/ModeToggle";
import { FcGoogle } from "react-icons/fc";
import httpClient, { restClient } from "@/lib/httpClient";
import type { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import { registerSchema } from "@/types/register-schema";
import type { RegisterSchema } from "@/types/register-schema";

type UserRole = "company" | "student";

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

export function UserRegisterForm() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<
    "google" | "github" | null
  >(null);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "student",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      companyWebsite: "",
      phoneNumber: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleSubmit = async (values: RegisterSchema) => {
    const trimmedEmail = values.email.trim();
    const trimmedPassword = values.password;
    const trimmedCompanyName = (values.companyName || "").trim();
    const trimmedPhone = (values.phoneNumber || "").trim();
    const trimmedWebsite = (values.companyWebsite || "").trim();

    try {
      if (values.role === "company") {
        await httpClient.post("/api/companies", {
          company_name: trimmedCompanyName,
          website: trimmedWebsite || undefined,
          phone_number: trimmedPhone,
          company_email: trimmedEmail,
          password: trimmedPassword,
          password_confirmation: values.confirmPassword,
        });
      } else {
        const [firstName, ...rest] = (values.name || "")
          .trim()
          .split(/\s+/)
          .filter(Boolean);
        const lastName = rest.join(" ") || undefined;

        await restClient.createUser({
          email: trimmedEmail,
          password: trimmedPassword,
          passwordConfirmation: values.confirmPassword,
          firstName,
          lastName,
        });
      }

      toast.success(
        "Account created successfully! Check your email to verify."
      );

      form.reset({
        role: values.role,
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        companyName: "",
        companyWebsite: "",
        phoneNumber: "",
      });
    } catch (err: any) {
      const serverError = err?.response?.data as HttpErrorResponse | undefined;
      const detail = serverError?.message || serverError?.generalErrors?.[0];
      toast.error(detail || "Registration failed. Please try again.");
    }
  };

  const handleOAuthRegister = async (provider: "google" | "github") => {
    setIsOAuthLoading(provider);

    // TODO: Implement actual OAuth logic
    console.log("OAuth register attempt:", { provider, role: selectedRole });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsOAuthLoading(null);
  };

  const heroContent = {
    student: {
      image: "/images/student-writing-notes-modern-workspace.jpg",
      title: "Start your journey to professional success",
      description:
        "Create your profile and get discovered by leading companies seeking talented interns. Your dream internship awaits.",
    },
    company: {
      image: "/images/business-professionals-office-meeting.jpg",
      title: "Discover your next great hire",
      description:
        "Post internship opportunities and connect with bright students eager to contribute. Build relationships that last beyond the internship.",
    },
  };

  const currentHero = heroContent[selectedRole];

  return (
    <div className="min-h-screen lg:h-screen flex relative">
      {/* Theme toggle top-right */}
      <div className="absolute right-4 top-4 z-50">
        <ModeToggle />
      </div>
      {/* Left Side - Visual Hero */}
      <div className="hidden lg:flex lg:w-1/2 lg:h-screen bg-primary relative overflow-hidden">
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
      <div className="flex-1 lg:w-1/2 lg:h-screen lg:overflow-y-auto">
        <div className="flex items-center lg:items-start justify-center h-full p-6 lg:p-12 bg-background">
          <div className="w-full max-w-md space-y-6 ">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">
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
                Create your account
              </h2>
              <p className="text-muted-foreground text-pretty">
                Join InternDoor and unlock new opportunities
              </p>
            </div>

            <div className="space-y-6 pb-6 lg:pb-12">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  I am registering as a
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.id);
                        form.setValue("role", role.id, { shouldValidate: true });
                      }}
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
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  {selectedRole !== "company" && (
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Full name
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="John Doe"
                              disabled={isSubmitting || isOAuthLoading !== null}
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {selectedRole === "company" && (
                    <>
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Company name
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Acme Corporation"
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
                        name="companyWebsite"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Company website
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="url"
                                placeholder="https://www.company.com"
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
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Phone number
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="+95 (555) 000-0000"
                                disabled={isSubmitting || isOAuthLoading !== null}
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {selectedRole === "company"
                            ? "Company email"
                            : "Email address"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@ucstgi.edu.mm"
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
                        <FormLabel className="text-sm font-medium">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
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

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Confirm password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Re-enter your password"
                              disabled={isSubmitting || isOAuthLoading !== null}
                              className="pr-10 h-11"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                              <span className="sr-only">
                                {showConfirmPassword ? "Hide password" : "Show password"}
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
                    {isSubmitting ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </Form>
              {selectedRole === "company" && (
                <>
                  <div className="space-y-4">
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
                        onClick={() => handleOAuthRegister("google")}
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
                      disabled={isOAuthLoading !== null || isSubmitting}
                    onClick={() => handleOAuthRegister("github")}
                    className="gap-2 h-11"
                  >
                    {isOAuthLoading === "github" ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    )}
                    GitHub
                  </Button> */}
                    </div>
                  </div>
                </>
              )}

              <div className="text-center text-sm text-muted-foreground ">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
