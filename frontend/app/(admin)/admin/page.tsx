// export default function AdminHomePage() {
//   return (
//     <div className="w-full max-w-3xl mx-auto py-10 px-6">
//       <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
//       <p className="text-muted-foreground mb-6">
//         Welcome! Use the navigation to manage users and view notifications.
//       </p>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <a href="/admin/users" className="rounded-lg border p-4 hover:bg-secondary transition-colors">
//           <h2 className="font-semibold">Users</h2>
//           <p className="text-sm text-muted-foreground">View and manage user accounts</p>
//         </a>
//         <a href="/admin/notifications" className="rounded-lg border p-4 hover:bg-secondary transition-colors">
//           <h2 className="font-semibold">Notifications</h2>
//           <p className="text-sm text-muted-foreground">Review system notifications</p>
//         </a>
//       </div>
//     </div>
//   );
// }

import { redirect } from "next/navigation"

export default function Home() {
  redirect("/admin/dashboard")
}
