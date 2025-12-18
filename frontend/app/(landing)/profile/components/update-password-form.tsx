"use client";

import ErrorFeedback from "@/components/error-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthGuard } from "@/lib/auth/use-auth";
import httpClient from "@/lib/httpClient";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    oldPassword: z.string().optional(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Schema = z.infer<typeof schema>;
export default function UpdatePasswordForm() {
  const { user, mutate } = useAuthGuard({ middleware: "auth" });
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(
    undefined
  );
  const [formState, setFormState] = React.useState<Schema>({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(undefined);

    const result = schema.safeParse(formState);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? "Please fix validation errors.";
      toast.error(firstError);
      return;
    }

    try {
      setIsSubmitting(true);
      await httpClient.patch("/api/users/password", result.data);
      toast.success("Password updated successfully");
      mutate();
      setFormState({ oldPassword: "", password: "", confirmPassword: "" });
    } catch (error: any) {
      const errData = error?.response?.data as HttpErrorResponse;
      setErrors(errData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-screen-sm">
      <form onSubmit={onSubmit} className="flex flex-col gap-y-3">
        <div className="space-y-1">
          <Label htmlFor="oldPassword">Old password</Label>
          <Input
            id="oldPassword"
            type="password"
            value={formState.oldPassword ?? ""}
            onChange={(e) => setFormState((s) => ({ ...s, oldPassword: e.target.value }))}
            autoComplete="current-password"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            value={formState.password}
            onChange={(e) => setFormState((s) => ({ ...s, password: e.target.value }))}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formState.confirmPassword}
            onChange={(e) => setFormState((s) => ({ ...s, confirmPassword: e.target.value }))}
            autoComplete="new-password"
            required
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="self-start">
          {isSubmitting ? "Saving..." : "Update password"}
        </Button>
      </form>

      <ErrorFeedback data={errors} className="mt-2" />
    </div>
  );
}
