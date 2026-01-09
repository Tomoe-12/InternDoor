"use client";

import React from "react";
import { UserRegisterForm } from "./components/register-form";
import { useAuthGuard } from "@/lib/auth/use-auth";
import { Role } from "@/models/user/UserResponse";

export default function RegisterPage() {
  // Redirect authenticated users away from the register page
  useAuthGuard({
    middleware: "guest",
    redirectIfAuthenticated: (user) => {
      if (user.role === Role.ADMIN) return "/admin";
      if (user.role === Role.COMPANY) {
        const needsSetup = user.profileComplete === false;
        return needsSetup ? "/company/onboarding" : "/company/dashboard";
      }
      return "/profile";
    },
  });

  return (
    <div>
      <UserRegisterForm />
    </div>
  );
}
