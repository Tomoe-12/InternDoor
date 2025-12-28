import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
// Note: Sidebar is mounted in the (dashboard) nested layout.

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
    <div className={inter.className}>{children}</div>
  )
}
