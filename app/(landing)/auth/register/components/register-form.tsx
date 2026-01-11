"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, DoorOpen } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ModeToggle from "@/components/ModeToggle";
import { FcGoogle } from "react-icons/fc";
import { useAction } from "next-safe-action/hooks";
import { registerSchema, type RegisterSchema } from "@/types/register-schema";
import { registerCompanyAction } from "@/server/actions/auth.actions";

const heroContent = {
  image: "/images/business-professionals-office-meeting.jpg",
  title: "Discover your next great hire",
  description:
    "Post internship opportunities and connect with bright students eager to contribute. Build relationships that last beyond the internship.",
};

export function CompanyRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<"google" | "github" | null>(null);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyWebsite: "",
      phoneNumber: "",
    },
  });

  const companyAction = useAction(registerCompanyAction, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(String(data.error));
        return;
      }
      if (data?.success) {
        toast.success(data.success);
      }
      form.reset({
        companyName: "",
        email: "",
        password: "",
        confirmPassword: "",
        companyWebsite: "",
        phoneNumber: "",
      });
    },
    onError: ({ error }) => {
      if (error?.serverError) {
        toast.error(String(error.serverError));
      } else {
        toast.error("Registration failed. Please try again.");
      }
    },
  });

  const isSubmitting = form.formState.isSubmitting || companyAction.isExecuting;

  const handleSubmit = (values: RegisterSchema) => {
    const trimmedCompanyName = values.companyName.trim();
    const trimmedEmail = values.email.trim();
    const trimmedPassword = values.password;
    const trimmedWebsite = (values.companyWebsite || "").trim();
    const trimmedPhone = (values.phoneNumber || "").trim();

    companyAction.execute({
      companyName: trimmedCompanyName,
      companyEmail: trimmedEmail,
      password: trimmedPassword,
      passwordConfirmation: values.confirmPassword,
      website: trimmedWebsite || undefined,
      phoneNumber: trimmedPhone,
    });
  };

  const handleOAuthRegister = async (provider: "google" | "github") => {
    setIsOAuthLoading(provider);

    // TODO: Implement actual OAuth logic
    console.log("OAuth register attempt:", { provider, role: "company" });

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsOAuthLoading(null);
  };

  return (
    <div className="min-h-screen lg:h-screen flex relative">
      <div className="absolute right-4 top-4 z-50">
        <ModeToggle />
      </div>

      <div className="hidden lg:flex lg:w-1/2 lg:h-screen bg-primary relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroContent.image})` }}
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
              {heroContent.title}
            </h1>
            <p className="text-lg text-primary-foreground/80 text-pretty leading-relaxed">
              {heroContent.description}
            </p>
          </div>
          <div className="text-sm text-primary-foreground/60">
            © 2025 InternDoor. All rights reserved.
          </div>
        </div>
      </div>

      <div className="flex-1 lg:w-1/2 lg:h-screen lg:overflow-y-auto">
        <div className="flex items-center lg:items-start justify-center h-full p-6 lg:p-12 bg-background">
          <div className="w-full max-w-md space-y-6 ">
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
                Register your company
              </h2>
              <p className="text-muted-foreground text-pretty">
                Companies can create an account. Student accounts are provisioned by university or super admins.
              </p>
            </div>

            <div className="space-y-6 pb-6 lg:pb-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Company name</FormLabel>
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
                        <FormLabel className="text-sm font-medium">Company website</FormLabel>
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
                        <FormLabel className="text-sm font-medium">Phone number</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Company email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@company.com"
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
                        <FormLabel className="text-sm font-medium">Password</FormLabel>
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
                        <FormLabel className="text-sm font-medium">Confirm password</FormLabel>
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
                    {isSubmitting ? "Creating account..." : "Create company account"}
                  </Button>
                </form>
              </Form>

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
                </div>
              </div>

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
