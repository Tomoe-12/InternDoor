"use client";

import Loading from "@/components/loading";
import PermissionGuard from "@/components/permission-guard";
import RoleGuard from "@/components/role-guard";
import { useAuthGuard } from "@/lib/auth/use-auth";
import { Role } from "@/models/user/UserResponse";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthGuard({ middleware: "auth" });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) return;

    const isCompanySection = pathname?.startsWith("/company");
    const isOnboarding = pathname === "/company/onboarding";

    if (
      user.role === Role.COMPANY &&
      isCompanySection &&
      !isOnboarding &&
      (user as any)?.profileComplete === false
    ) {
      router.replace("/company/onboarding");
    }
  }, [user, pathname, router]);

  const shouldShowLoading = !user;

  return (
    <div className="min-h-screen">
      {shouldShowLoading ? (
        <Loading />
      ) : (
        <>
          <PermissionGuard rolesAllowed={[Role.COMPANY]} />
          <RoleGuard rolesAllowed={[Role.COMPANY]}>{children}</RoleGuard>
        </>
      )}
    </div>
  );
}
