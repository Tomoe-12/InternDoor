"use client";

import PermissionGuard from "@/components/permission-guard";
import RoleGuard from "@/components/role-guard";
import { Role } from "@/models/user/UserResponse";

export default function CompanyPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6 text-center">
        <PermissionGuard rolesAllowed={[Role.COMPANY]} />
        <RoleGuard rolesAllowed={[Role.COMPANY]}>
          <h1 className="text-3xl font-bold">Company Portal</h1>
          <p className="text-muted-foreground">
            The company site is coming soon. You’re logged in with a company
            account and will be able to access dedicated features here when
            they’re ready.
          </p>
        </RoleGuard>
      </div>
    </div>
  );
}
