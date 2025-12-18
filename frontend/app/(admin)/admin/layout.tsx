"use client";

import Loading from "@/components/loading";
import PermissionGuard from "@/components/permission-guard";
import RoleGuard from "@/components/role-guard";
import { useAuthGuard } from "@/lib/auth/use-auth";
import { Role } from "@/models/user/UserResponse";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthGuard({ middleware: "auth" });

  if (!user) return <Loading />;

  return (
    <div className="min-h-screen">
      <PermissionGuard rolesAllowed={[Role.ADMIN]} />
      <RoleGuard rolesAllowed={[Role.ADMIN]}>{children}</RoleGuard>
    </div>
  );
}
