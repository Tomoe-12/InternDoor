"use client";

import FileUpload from "@/components/FileUpload";
import { Label } from "@/components/ui/label";
import { useAuthGuard } from "@/lib/auth/use-auth";
import httpClient from "@/lib/httpClient";
import React from "react";
import { toast } from "sonner";

export default function UpdateProfileImageForm() {
  const { user, mutate } = useAuthGuard({middleware: "auth"});

  const handleLogoChange = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    httpClient.patch(`/api/students/${user?.id}/profile-picture`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {
        toast.success("Profile picture updated successfully");
        mutate();
      })
      .catch((error) => {
        toast.error("Failed to update profile picture");
      });
  };

  return (
    <div className="flex gap-4 flex-col">
      <Label>Profile picture</Label>
      <FileUpload
        onFileSelect={(file) => handleLogoChange(file)}
        allowedTypes={["image/png", "image/jpg", "image/jpeg"]}
        onValidationError={(err) => {
          toast.error(err);
        }}
      >
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
          {user?.profileImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xl font-semibold text-muted-foreground">
              {(user?.firstName || user?.email || "U").charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </FileUpload>
    </div>
  );
}
