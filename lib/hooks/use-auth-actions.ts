"use client";

import { useAction } from "next-safe-action/hooks";
import { loginAction } from "@/server/actions/auth.actions";
import { createStudentAction } from "@/server/actions/student.actions";
import { createCompanyAction } from "@/server/actions/company.actions";

/**
 * Hook for authentication using Next Safe Actions
 * Use this in React components instead of the old httpClient approach
 */
export function useAuthActions() {
  const login = useAction(loginAction);
  const createStudent = useAction(createStudentAction);
  const createCompany = useAction(createCompanyAction);

  return {
    login,
    createStudent,
    createCompany,
  };
}
