"use client";

import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import "@mantine/core/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
} from "@mantine/core";
import { ThemeProvider } from "@/components/theme-provider";
import ServiceWorkerGuard from "@/components/ServiceWorkerGuard";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider>
          <ServiceWorkerGuard />
          <MantineProvider>{children}</MantineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
