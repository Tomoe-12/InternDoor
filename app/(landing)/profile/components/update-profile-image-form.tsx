"use client";

import { FileUpload } from "@/components/FileUpload";
import { Label } from "@/components/ui/label";
import { useAuthGuard } from "@/lib/auth/use-auth";
import httpClient from "@/lib/httpClient";
import React, { useState } from "react";
import { toast } from "sonner";

export default function UpdateProfileImageForm() {
  const { user, mutate } = useAuthGuard({middleware: "auth"});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
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
    }
  };

  return (
    <div className="flex gap-4 flex-col">
      <Label>Profile picture</Label>
      <FileUpload
        value={selectedFile}
        onChange={handleFileChange}
        accept="image/png,image/jpg,image/jpeg"
        maxSize={5 * 1024 * 1024} // 5MB
      />
    </div>
  );
}
