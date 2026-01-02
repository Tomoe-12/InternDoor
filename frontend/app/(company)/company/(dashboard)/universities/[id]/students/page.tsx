"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Search, Filter, Download } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Suspense } from "react" // Added Suspense import
import { useRouter } from "next/navigation"

function StudentsContent({ params }: { params: { id: string } }) {
  const router = useRouter()
  // Mock data for the specific university
  const universityName = "Massachusetts Institute of Technology"
  const students = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.j@mit.edu",
      major: "Computer Science",
      year: "Junior",
      status: "Active",
    },
    {
      id: "9",
      name: "Ava Rodriguez",
      email: "ava.r@mit.edu",
      major: "Mechanical Engineering",
      year: "Senior",
      status: "Active",
    },
    {
      id: "17",
      name: "Amelia Harris",
      email: "amelia.h@mit.edu",
      major: "Mathematics",
      year: "Freshman",
      status: "Active",
    },
    { id: "25", name: "Emily Lewis", email: "emily.l@mit.edu", major: "Physics", year: "Sophomore", status: "Pending" },
    // ... more mock data ...
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild onClick={()=>router.back()}>
            <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Students</h1>
          <p className="text-muted-foreground">{universityName}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-9" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Student</TableHead>
                <TableHead>Major</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{student.name}</span>
                        <span className="text-xs text-muted-foreground">{student.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{student.major}</TableCell>
                  <TableCell className="text-sm">{student.year}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0">
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/users/${student.id}`}>View Profile</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function UniversityStudentsPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={null}>
      <StudentsContent params={params} />
    </Suspense>
  )
}
