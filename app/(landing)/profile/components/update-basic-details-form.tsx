"use client"

import ErrorFeedback from "@/components/common/error-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthGuard } from "@/lib/auth/use-auth";
import { restClient } from "@/lib/httpClient";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2)
});

type Schema = z.infer<typeof schema>;
export default function UpdateBasicDetailsForm() {
  const { user, mutate } = useAuthGuard({ middleware: "auth" });
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(undefined);
  const [formState, setFormState] = React.useState<Schema>({ firstName: "", lastName: "" });
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
      await restClient.updateUser(user!.id.toString(), result.data);
      toast.success("Profile updated successfully");
      mutate();
    } catch (error: any) {
      const errData = error?.response?.data as HttpErrorResponse;
      setErrors(errData);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user])

  return (
    <div className="max-w-screen-sm">
      <form onSubmit={onSubmit} className="flex flex-col gap-y-3">
        <div className="space-y-1">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            value={formState.firstName}
            onChange={(e) => setFormState((s) => ({ ...s, firstName: e.target.value }))}
            placeholder="John"
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            value={formState.lastName}
            onChange={(e) => setFormState((s) => ({ ...s, lastName: e.target.value }))}
            placeholder="Doe"
            required
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="self-start">
          {isSubmitting ? "Saving..." : "Update profile"}
        </Button>
      </form>

      <ErrorFeedback data={errors} />
    </div>
  );
}
