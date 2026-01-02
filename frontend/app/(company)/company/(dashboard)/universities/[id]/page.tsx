"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, School, MapPin, Users, Globe, Mail, Phone, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { use } from "react"

export default function UniversityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = use(params)
  const router = useRouter()
  // Mock data fetching based on ID
  const uni = {
    id: id,
    name: "Massachusetts Institute of Technology",
    location: "Cambridge, MA",
    studentsCount: 11520,
    website: "https://www.mit.edu",
    email: "admissions@mit.edu",
    phone: "+1 617-253-1000",
    description:
      "The Massachusetts Institute of Technology is a private land-grant research university in Cambridge, Massachusetts. Established in 1861, MIT has played a key role in the development of modern technology and science.",
    enrolledStudents: [
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
      {
        id: "25",
        name: "Emily Lewis",
        email: "emily.l@mit.edu",
        major: "Physics",
        year: "Sophomore",
        status: "Pending",
      },
    ],
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild className="mt-1">
          {/* <Link href="universities">
            <ArrowLeft className="h-5 w-5" />
          </Link> */}
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
        </Button>
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{uni.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {uni.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> {uni.studentsCount.toLocaleString()} Students
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4" />{" "}
                  <a
                    href={uni.website}
                    target="_blank"
                    className="hover:text-primary transition-colors underline-offset-4 hover:underline"
                    rel="noreferrer"
                  >
                    {uni.website}
                  </a>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">Edit Details</Button>
              <Button>Message Admin</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>About University</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{uni.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Contact Email</div>
                    <div className="text-sm text-muted-foreground">{uni.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Phone Number</div>
                    <div className="text-sm text-muted-foreground">{uni.phone}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Enrolled Students</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`${id}/students`} className="flex items-center gap-1">
                  View all students <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
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
                  {uni.enrolledStudents.map((student) => (
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
                          <Link href={`/users/${student.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stats Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Placement Rate</span>
                  <span className="font-bold">94%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "94%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active Internships</span>
                  <span className="font-bold">42</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: "65%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg. Salary</span>
                  <span className="font-bold">$125k</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: "85%" }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="secondary" className="w-full justify-start text-sm">
                <Mail className="h-4 w-4 mr-2" /> Email all students
              </Button>
              <Button variant="secondary" className="w-full justify-start text-sm">
                <Users className="h-4 w-4 mr-2" /> Batch verify profiles
              </Button>
              <Button variant="secondary" className="w-full justify-start text-sm">
                <School className="h-4 w-4 mr-2" /> Download Uni Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
