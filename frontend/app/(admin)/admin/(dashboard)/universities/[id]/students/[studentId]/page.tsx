"use client"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Mail, Phone, MapPin, GraduationCap, Shield } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { use } from "react"

export default function UniversityStudentProfilePage({ params }: { params: { id: string; studentId: string } }) {
  const {id, studentId} = use(params)
  const router = useRouter()
  
  // Mock data for the specific student
  const student = {
    id: studentId,
    name: "Sarah Johnson",
    role: "Student",
    email: "sarah.j@mit.edu",
    phone: "+1 (555) 123-4567",
    location: "Cambridge, MA",
    universityId: params.id,
    universityName: "Massachusetts Institute of Technology",
    major: "Computer Science",
    year: "Junior",
    gpa: "3.92",
    status: "Active",
    avatar: "/placeholder.svg?height=128&width=128",
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Profile</h1>
          <p className="text-muted-foreground">{student.universityName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={student.avatar || "/placeholder.svg"} />
              <AvatarFallback>{student.name[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{student.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">{student.major}</p>
            <Badge variant="secondary" className="mb-6">
              {student.status}
            </Badge>

            <div className="w-full space-y-4 text-left">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{student.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{student.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader className="p-0 border-b">
            <Tabs defaultValue="profile" className="w-full">
              <div className="px-6 pt-4">
                <TabsList className="bg-transparent border-b-0 w-full justify-start gap-6 h-12 p-0">
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-12"
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="academic"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-12"
                  >
                    Academic Application
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-12"
                  >
                    Security
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="profile" className="mt-0 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs uppercase font-bold tracking-wider">
                        Full Name
                      </Label>
                      <p className="font-medium">{student.name}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Major</Label>
                      <p className="font-medium">{student.major}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Year</Label>
                      <p className="font-medium">{student.year}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs uppercase font-bold tracking-wider">GPA</Label>
                      <p className="font-medium">{student.gpa}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="academic" className="mt-0">
                  <div className="p-8 border-2 border-dashed rounded-lg text-center">
                    <GraduationCap className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      No active academic applications for this university.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Profile Visibility</p>
                          <p className="text-xs text-muted-foreground">Manage who can see this student profile</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
