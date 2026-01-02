"use client";

import React from "react";
import Logo from "./common/logo";
import ModeToggle from "./ModeToggle";
import { UserNav } from "./user-nav";
import { useAuthGuard } from "@/lib/auth/use-auth";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X, ArrowRight, LayoutDashboard, Building2, User as UserIcon } from "lucide-react";
import { Role } from "@/models/user/UserResponse";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Product", href: "#product" },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "About", href: "#about" },
];

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

// export default function Navbar() {
export default function Navbar({ className, ...props }: NavbarProps) {
  const { user } = useAuthGuard({ middleware: "guest" });
  const pathname = usePathname();

  // Hide navbar on admin and auth routes
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) {
    return null;
  }
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const gologin=()=>{
    window.location.href="/auth/login"
  }

  // Unified click handler for CTA: closes mobile menu and navigates to login
  const handleClick = () => {
    setIsMobileMenuOpen(false)
    gologin()
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
        isScrolled
          ? "w-[calc(100%-2rem)] max-w-3xl"
          : "w-[calc(100%-2rem)] max-w-4xl"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 rounded-full border backdrop-blur-xl transition-all duration-300",
          "bg-nav-bg border-nav-border shadow-lg shadow-foreground/5"
        )}
      >
      <Logo/>
        {/* <Link
          href="/"
          className="text-lg font-semibold text-foreground tracking-tight"
        >
          <Logo />
        </Link> */}

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <ModeToggle />
          {!user && (
            <Button onClick={handleClick} size="sm" className="rounded-full px-5">
              <span>Get Started</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {/* {user && user.role === Role.ADMIN && (
            <Link href="/admin">
              <Button size="sm" className="rounded-full px-5">
                <span>Admin</span>
                <LayoutDashboard className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )} */}
          {user && user.role === Role.COMPANY && (
            <Link href="/company">
              <Button size="sm" className="rounded-full px-5">
                <span>Company</span>
                <Building2 className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
          {user && user.role === Role.USER && (
            <Link href="/profile">
              <Button size="sm" className="rounded-full px-5">
                <span>Profile</span>
                <UserIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <ModeToggle />
          <button
            className="p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-panel"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile panel */}
      <div
        id="mobile-nav-panel"
        className={cn(
          "md:hidden fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl rounded-2xl border bg-nav-bg border-nav-border backdrop-blur-xl shadow-lg transition-all duration-300",
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="flex flex-col p-4 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-3 text-base text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <hr className="my-3 border-border" />

          {!user && (
            <Button onClick={() => { setIsMobileMenuOpen(false); handleClick(); }} className="rounded-full mt-2 w-full">
              <span>Get Started</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {/* {user && user.role === Role.ADMIN && (
            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="rounded-full w-full mt-2">
                <span>Admin</span>
                <LayoutDashboard className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )} */}
          {user && user.role === Role.COMPANY && (
            <Link href="/company" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="rounded-full w-full mt-2">
                <span>Company</span>
                <Building2 className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
          {user && user.role === Role.USER && (
            <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="rounded-full w-full mt-2">
                <span>Profile</span>
                <UserIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
