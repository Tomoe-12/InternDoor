// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { UsersIcon, WalletIcon, UserPlusIcon, UserXIcon } from "lucide-react"
// import { DashboardChart } from "@/components/Admin/dashboard-chart"
// import { RecentTransactions } from "@/components/Admin/recent-transactions"

// export default function DashboardPage() {
//   return (
//     <div className="flex flex-col gap-4">
//       <div>
//         <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
//         <p className="text-muted-foreground">Overview of your platform statistics and performance.</p>
//       </div>

//       <Tabs defaultValue="daily" className="space-y-4">
//         <div className="flex items-center justify-between">
//           <TabsList>
//             <TabsTrigger value="daily">Daily</TabsTrigger>
//             <TabsTrigger value="weekly">Weekly</TabsTrigger>
//             <TabsTrigger value="monthly">Monthly</TabsTrigger>
//           </TabsList>
//         </div>

//         <TabsContent value="daily" className="space-y-4">
//           <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">New Users Today</CardTitle>
//                 <UserPlusIcon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">24</div>
//                 <p className="text-xs text-muted-foreground">+12% from yesterday</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//                 <UsersIcon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">1,284</div>
//                 <p className="text-xs text-muted-foreground">+2.5% from last week</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Transactions Today</CardTitle>
//                 <WalletIcon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">R 12,543</div>
//                 <p className="text-xs text-muted-foreground">+18% from yesterday</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Non-Users</CardTitle>
//                 <UserXIcon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">342</div>
//                 <p className="text-xs text-muted-foreground">-4% from yesterday</p>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="weekly" className="space-y-4">
//           <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">New Users This Week</CardTitle>
//                 <UserPlusIcon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">156</div>
//                 <p className="text-xs text-muted-foreground">+8% from last week</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//                 <UsersIcon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">1,284</div>
//                 <p className="text-xs text-muted-foreground">+2.5% from last week</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Transactions This Week</CardTitle>
//                 <WalletIcon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">R 87,651</div>
//                 <p className="text-xs text-muted-foreground">+12% from last week</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Non-Users</CardTitle>
//                 <UserXIcon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">342</div>
//                 <p className="text-xs text-muted-foreground">-4% from last week</p>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="monthly" className="space-y-4">
//           <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">New Users This Month</CardTitle>
//                 <UserPlusIcon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">642</div>
//                 <p className="text-xs text-muted-foreground">+15% from last month</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//                 <UsersIcon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">1,284</div>
//                 <p className="text-xs text-muted-foreground">+2.5% from last month</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Transactions This Month</CardTitle>
//                 <WalletIcon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">R 324,845</div>
//                 <p className="text-xs text-muted-foreground">+22% from last month</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Non-Users</CardTitle>
//                 <UserXIcon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">342</div>
//                 <p className="text-xs text-muted-foreground">-4% from last month</p>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>

//       <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
//         <Card className="lg:col-span-4">
//           <CardHeader>
//             <CardTitle>Transaction Overview</CardTitle>
//             <CardDescription>Transaction volume over time</CardDescription>
//           </CardHeader>
//           <CardContent className="pl-2">
//             <DashboardChart />
//           </CardContent>
//         </Card>

//         <Card className="lg:col-span-3">
//           <CardHeader>
//             <CardTitle>Recent Transactions</CardTitle>
//             <CardDescription>Latest transactions on the platform</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <RecentTransactions />
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, BriefcaseIcon, TrendingUp } from "lucide-react"
import { DashboardChart } from "@/components/Admin/dashboard-chart"
import { RecentActivity } from "@/components/Admin/recent-activity"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of student-company connections and internship activity.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,942</div>
            <p className="text-xs text-muted-foreground">+24% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Matches</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,156</div>
            <p className="text-xs text-muted-foreground">+32% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
            <CardDescription>Internship applications over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <DashboardChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest student-company interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
