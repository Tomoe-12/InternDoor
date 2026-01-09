"use client";

import Logo from "@/components/common/logo";
import Navbar from "@/components/navbar";
import { useSubscribeToPushNotifications } from "@/lib/hooks/useSubscribeToPushNotifications";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function layout({ children }: { children: React.ReactNode }) {
  const { subscribe, subscription } = useSubscribeToPushNotifications();
  const pathname = usePathname();
  const hideNavbar = pathname?.startsWith("/auth" ) ;

  useEffect(() => {
    if (!subscription) subscribe();
  }, [subscription]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!hideNavbar && (
        <header className="w-full">
          <div className="w-full max-w-screen-xl mx-auto px-4 py-3">
            <Navbar className="w-full" />
          </div>
        </header>
      )}

      {/* <main className="pt-20 px-4 max-w-screen-xl mx-auto">
       */}
      <main>{children}</main>
    </div>
  );
}
