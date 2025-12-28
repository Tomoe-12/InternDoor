// import type React from "react"
// import { Header } from "../../../../components/Admin/header"
// import {
//   Sidebar,
//   SidebarProvider,
//   SidebarInset,
//   SidebarHeader,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
// } from "../../../../components/ui/sidebar"

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <SidebarProvider>
//       <Sidebar>
//         <SidebarHeader>
//           <div className="text-lg font-semibold px-2 py-1">Admin</div>
//         </SidebarHeader>
//         <SidebarContent>
//           <SidebarGroup>
//             <SidebarGroupLabel>Navigation</SidebarGroupLabel>
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 <SidebarMenuItem>
//                   <SidebarMenuButton asChild>
//                     <a href="/admin/dashboard"><span>Dashboard</span></a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//                 <SidebarMenuItem>
//                   <SidebarMenuButton asChild>
//                     <a href="/admin/users"><span>Users</span></a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         </SidebarContent>
//       </Sidebar>
//       <SidebarInset>
//         <Header />
//         <main className="p-4 md:p-6 lg:p-8">{children}</main>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }

// import type React from "react"
// import type { Metadata } from "next"
// import { Inter } from "next/font/google"
// import "../../../globals.css"
// import { SidebarProvider } from "../../../../components/Admin/sidebar-provider"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "Sambo Admin Dashboard",
//   description: "Admin dashboard for Sambo wallet management",
//     generator: 'v0.app'
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <SidebarProvider>{children}</SidebarProvider>
//       </body>
//     </html>
//   )
// }

import type React from "react"
import { Sidebar } from "@/components/Admin/sidebar"
import { Header } from "@/components/Admin/header"
import { SidebarProvider } from "@/components/sidebar-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="lg:pl-72">
          <Header />
          <main className="p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

