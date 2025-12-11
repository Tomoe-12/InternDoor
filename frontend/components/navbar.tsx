// "use client";

// import { cn } from "@/lib/utils";
// import Link from "next/link";
// import React from "react";
// import Logo from "./Logo";
// import ModeToggle from "./ModeToggle";
// import Container from "./Container";
// import { useAuthGuard } from "@/lib/auth/use-auth";
// import { UserNav } from "./user-nav";
// import AdminNav from "./admin-nav";
// import { Button } from "@mantine/core";

// interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
//   orientation?: "horizontal" | "vertical";
// }
// export default function Navbar({ className, ...props }: NavbarProps) {
//   const { user } = useAuthGuard({ middleware: "guest" });

//   return (
//     <div className={cn(className)} {...props}>
//       <Container
//         size="xl"
//         className={cn(
//           "flex justify-between items-center bg-card py-2 px-4 z-10",
//           props.orientation === "vertical" ? "flex-col" : "flex-row"
//         )}
//       >
//         <Logo />

//         <div className="flex gap-x-2 items-center">
//           <ModeToggle />

//           <AdminNav />
//           {user && <UserNav />}
//           {user?.authorities.includes("ROLE_PREVIOUS_ADMINISTRATOR") && (
//             <a href={"/api/auth/impersonate/exit"}>
//               <Button>Exit switch</Button>
//             </a>
//           )}

//           {!user && (
//             <Link href={"/auth/login"}>
//               <Button variant={"outline"}>Login</Button>
//             </Link>
//           )}
//         </div>
//       </Container>
//     </div>
//   );
// }

"use client";

import React from "react";
import Logo from "./logo";
import ModeToggle from "./ModeToggle";
// import Container from "./Container";
import { useAuthGuard } from "@/lib/auth/use-auth";
import { UserNav } from "./user-nav";
import AdminNav from "./admin-nav";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          {/* <Link
            href="#login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Log in
          </Link> */}
          <ModeToggle />
          <Button size="sm" className="rounded-full px-5">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
         <div className="md:hidden bg-red-500">
          <ModeToggle />
         </div>
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden mt-2 rounded-2xl border bg-nav-bg border-nav-border backdrop-blur-xl overflow-hidden transition-all duration-300",
          isMobileMenuOpen
            ? "opacity-100 translate-y-0 max-h-96"
            : "opacity-0 -translate-y-4 max-h-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col p-4 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <hr className="my-2 border-border" />
          {/* <ModeToggle /> */}
          <Button className="rounded-full mt-2">Get Started</Button>
        </div>
      </div>
    </nav>
  );
}
