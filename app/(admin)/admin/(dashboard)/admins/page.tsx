"use client"

import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Trash2 } from "lucide-react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"

const Loading = () => null

function AdminsContent() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock admin data
  const admins = [
    {
      id: "1",
      name: "Dr. Robert Chen",
      email: "r.chen@mit.edu",
      university: "Massachusetts Institute of Technology",
      role: "Admin",
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Sarah Miller",
      email: "s.miller@mit.edu",
      university: "Massachusetts Institute of Technology",
      role: "Admin",
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedDate: "2024-02-20",
    },
    {
      id: "3",
      name: "James Wilson",
      email: "j.wilson@stanford.edu",
      university: "Stanford University",
      role: "Admin",
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedDate: "2024-01-10",
    },
    {
      id: "4",
      name: "Emily Rodriguez",
      email: "e.rodriguez@harvard.edu",
      university: "Harvard University",
      role: "Admin",
      status: "Pending",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedDate: "2024-03-05",
    },
    {
      id: "5",
      name: "Michael Chang",
      email: "m.chang@caltech.edu",
      university: "California Institute of Technology",
      role: "Admin",
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedDate: "2024-02-01",
    },
    {
      id: "6",
      name: "Lisa Anderson",
      email: "l.anderson@yale.edu",
      university: "Yale University",
      role: "Admin",
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedDate: "2024-01-28",
    },
    {
      id: "7",
      name: "David Thompson",
      email: "d.thompson@stanford.edu",
      university: "Stanford University",
      role: "Admin",
      status: "Inactive",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedDate: "2023-12-10",
    },
    {
      id: "8",
      name: "Jessica Brown",
      email: "j.brown@mit.edu",
      university: "Massachusetts Institute of Technology",
      role: "Admin",
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedDate: "2024-03-01",
    },
  ]

  const universities = [
    "Massachusetts Institute of Technology",
    "Stanford University",
    "Harvard University",
    "California Institute of Technology",
    "Yale University",
  ]

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.university.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">University Administrators</h1>
            <p className="text-muted-foreground mt-2">
              Manage admins across all universities. Super Admin controls everything.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New University Admin</DialogTitle>
                <DialogDescription>
                  Invite a new administrator or coordinator for a specific university. Admins have full control; Coordinators focus on student management.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="admin@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="university">Assign to University</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select university" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map((uni) => (
                        <SelectItem key={uni} value={uni}>
                          {uni}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="coordinator">Coordinator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Admins</CardTitle>
            <CardDescription>
              {filteredAdmins.length} admin{filteredAdmins.length !== 1 ? "s" : ""} assigned to universities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-muted/30">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or university..."
                className="border-0 bg-transparent focus-visible:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.length > 0 ? (
                    filteredAdmins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={admin.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{admin.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{admin.name}</span>
                              <span className="text-xs text-muted-foreground">{admin.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{admin.university}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {admin.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={admin.status === "Active" ? "default" : admin.status === "Pending" ? "secondary" : "outline"}
                            className="text-[10px] uppercase font-bold tracking-wider px-2 py-0"
                          >
                            {admin.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(admin.joinedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No admins found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">About University Admin Roles</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-4">
            <div>
              <p className="font-semibold text-foreground mb-1">Admin</p>
              <p>
                Full administrative control over their assigned university. Can manage students, edit university details, manage coordinators, update settings, and oversee all institutional activities.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Coordinator</p>
              <p>
                Limited administrative access with focus on student management. Can view and manage students, handle student applications, but cannot edit university details or manage other staff members.
              </p>
            </div>
            <div className="border-t pt-3">
              <p>
                As a <strong>Super Admin</strong>, you maintain full control and can manage admins and coordinators across all universities in the system.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  )
}

export default function AdminsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminsContent />
    </Suspense>
  )
}
