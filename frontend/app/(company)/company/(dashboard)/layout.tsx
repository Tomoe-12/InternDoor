import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SidebarProvider } from "@/components/Admin/sidebar-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "InternDoor Admin Dashboard",
  description: "Admin dashboard for InternDoor - connecting students with companies",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>{children}</SidebarProvider>
      </body>
    </html>
  )
}
