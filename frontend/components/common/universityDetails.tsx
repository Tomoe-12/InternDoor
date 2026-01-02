import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  School,
  MapPin,
  Users,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthGuard } from "@/lib/auth/use-auth";
import { useRouter } from "next/navigation";

const UniversityDetails = ({ university_id }: { university_id: string }) => {
  const { user } = useAuthGuard({ middleware: "auth" });
  const router = useRouter();
  const uni = {
    id: university_id,
    name: "Massachusetts Institute of Technology",
    location: "Cambridge, MA",
    studentsCount: 11520,
    website: "https://www.mit.edu",
    email: "admissions@mit.edu",
    phone: "+1 617-253-1000",
    description:
      "The Massachusetts Institute of Technology is a private land-grant research university in Cambridge, Massachusetts. Established in 1861, MIT has played a key role in the development of modern technology and science.",
    admins: [
      {
        id: "a1",
        name: "Dr. Robert Chen",
        email: "r.chen@mit.edu",
        role: "Super Admin",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      {
        id: "a2",
        name: "Sarah Miller",
        email: "s.miller@mit.edu",
        role: "Coordinator",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    ],
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
  };
  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="mt-1 cursor-pointer  "
          onClick={() => router.back()}

        >
          {/* <Link href="/admin/universities"> */}
          <ArrowLeft className="h-5 w-5" />
          {/* </Link> */}
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
                  <Users className="h-4 w-4" />{" "}
                  {uni.studentsCount.toLocaleString()} Students
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
            {user?.role === "ADMIN" && (
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Edit Details</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Edit University Details</DialogTitle>
                      <DialogDescription>
                        Update all information for the university profile. Click
                        save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">University Name</Label>
                        <Input id="name" defaultValue={uni.name} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" defaultValue={uni.location} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="website">Website URL</Label>
                        <Input id="website" defaultValue={uni.website} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Contact Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={uni.email}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue={uni.phone} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="studentsCount">Student Count</Label>
                        <Input
                          id="studentsCount"
                          type="number"
                          defaultValue={uni.studentsCount}
                        />
                      </div>
                      <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          defaultValue={uni.description}
                          className="h-24"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Manage Admin</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>University Administrators</DialogTitle>
                      <DialogDescription>
                        Manage staff members who have administrative access to
                        this institution.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Enter email to invite..."
                          className="flex-1"
                        />
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" /> Invite
                        </Button>
                      </div>
                      <div className="space-y-3 pt-2">
                        {uni.admins.map((admin) => (
                          <div
                            key={admin.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={admin.avatar || "/placeholder.svg"}
                                />
                                <AvatarFallback>{admin.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">
                                  {admin.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {admin.role}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
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
              <p className="text-muted-foreground leading-relaxed">
                {uni.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Contact Email</div>
                    <div className="text-sm text-muted-foreground">
                      {uni.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Phone Number</div>
                    <div className="text-sm text-muted-foreground">
                      {uni.phone}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Enrolled Students</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href={`${university_id}/students`}
                  className="flex items-center gap-1"
                >
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
                            <span className="font-medium text-sm">
                              {student.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {student.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{student.major}</TableCell>
                      <TableCell className="text-sm">{student.year}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="text-[10px] uppercase font-bold tracking-wider px-2 py-0"
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`${university_id}/students/${student.id}`}
                          >
                            View
                          </Link>
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
                  <span className="text-muted-foreground">
                    Active Internships
                  </span>
                  <span className="font-bold">42</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: "65%" }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg. Salary</span>
                  <span className="font-bold">$125k</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: "85%" }}
                  />
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
              <Button
                variant="secondary"
                className="w-full justify-start text-sm"
              >
                <Mail className="h-4 w-4 mr-2" /> Email all students
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start text-sm"
              >
                <Users className="h-4 w-4 mr-2" /> Batch verify profiles
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start text-sm"
              >
                <School className="h-4 w-4 mr-2" /> Download Uni Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetails;
