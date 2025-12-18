"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Save, X, UserCog, GraduationCap, BriefcaseIcon, Shield, Download } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StudentApplications } from "@/components/Admin/student-applications"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingAcademic, setIsEditingAcademic] = useState(false)

  const user = users.find((u) => u.id === params.id!) || users[0]

  const handleExportGPA = () => {
    const csvContent = [
      ["Year", "Semester", "Start Date", "End Date", "GPA", "Course Code", "Course Name", "Grade", "Credits"],
      ...user!.academicRecords.flatMap((record) =>
        record.semesters.flatMap((semester) =>
          semester.subjects.map((subject) => [
            record.year,
            semester.name,
            semester.startDate,
            semester.endDate,
            semester.gpa.toFixed(2),
            subject.code,
            subject.name,
            subject.grade,
            subject.credits,
          ]),
        ),
      ),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${user!.name}_${user!.surname}_GPA_Report.csv`
    a.click()
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" asChild className="mt-1">
            <Link href="/admin/students">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {user!.name} {user!.surname}
            </h1>
            <p className="text-muted-foreground text-base mt-1">Student profile and application management</p>
          </div>
        </div>
        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
          <AvatarImage src={user!.profilePicture || "/placeholder.svg"} alt={`${user!.name} ${user!.surname}`} />
          <AvatarFallback className="text-2xl font-semibold">
            {user!.name[0]}
            {user!.surname[0]}
          </AvatarFallback>
        </Avatar>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="h-12">
          <TabsTrigger value="profile" className="text-base px-6">
            <UserCog className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="academic" className="text-base px-6">
            <GraduationCap className="h-4 w-4 mr-2" />
            Academic
          </TabsTrigger>
          <TabsTrigger value="applications" className="text-base px-6">
            <BriefcaseIcon className="h-4 w-4 mr-2" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="security" className="text-base px-6">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <div>
                <CardTitle className="text-2xl">Profile Information</CardTitle>
                <CardDescription className="text-base mt-1">View and update student profile details</CardDescription>
              </div>
              <Button
                variant={isEditingProfile ? "ghost" : "outline"}
                size="default"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
              >
                {isEditingProfile ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-base">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    defaultValue={user!.name}
                    disabled={!isEditingProfile}
                    className="h-11 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="surname" className="text-base">
                    Surname
                  </Label>
                  <Input
                    id="surname"
                    defaultValue={user!.surname}
                    disabled={!isEditingProfile}
                    className="h-11 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user!.email}
                    disabled={!isEditingProfile}
                    className="h-11 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-base">
                    Phone Number
                  </Label>
                  <Input id="phone" defaultValue={user!.phone} disabled={!isEditingProfile} className="h-11 text-base" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="university" className="text-base">
                    University
                  </Label>
                  <Input
                    id="university"
                    defaultValue={user!.university}
                    disabled={!isEditingProfile}
                    className="h-11 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="status" className="text-base">
                    Account Status
                  </Label>
                  <Select defaultValue={user!.status} disabled={!isEditingProfile}>
                    <SelectTrigger id="status" className="h-11 text-base">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            {isEditingProfile && (
              <div className="flex justify-end gap-3 p-6 pt-0">
                <Button variant="outline" size="lg" onClick={() => setIsEditingProfile(false)}>
                  Reset
                </Button>
                <Button size="lg" onClick={() => setIsEditingProfile(false)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <div>
                <CardTitle className="text-2xl">Academic Performance</CardTitle>
                <CardDescription className="text-base mt-1">
                  Complete academic history and performance records
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="default" onClick={handleExportGPA}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant={isEditingAcademic ? "ghost" : "outline"}
                  size="default"
                  onClick={() => setIsEditingAcademic(!isEditingAcademic)}
                >
                  {isEditingAcademic ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Overall GPA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{user!.overallGPA.toFixed(2)}</div>
                    <p className="text-sm text-muted-foreground mt-2">Out of 4.0</p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Current Year</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{user!.yearOfStudy}</div>
                    <p className="text-sm text-muted-foreground mt-2">Year of study</p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Major</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{user!.major}</div>
                    <p className="text-sm text-muted-foreground mt-2">{user!.minor && `Minor: ${user!.minor}`}</p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">University Period</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {user!.universityStartYear} - {user!.graduationYear}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Start - Graduation</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Academic Records by Year</h3>
                <Accordion type="single" collapsible className="w-full">
                  {user!.academicRecords.map((record, index) => (
                    <AccordionItem key={index} value={`year-${index}`} className="border-2 rounded-lg mb-4 px-4">
                      <AccordionTrigger className="hover:no-underline py-5">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="font-semibold text-lg">{record.year}</span>
                          <Badge variant="secondary" className="ml-auto mr-4 text-sm px-3 py-1">
                            Yearly GPA: {record.yearGPA.toFixed(2)}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-6 pt-4 pb-2">
                          {record.semesters.map((semester, semIndex) => (
                            <Card key={semIndex} className="border-2">
                              <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg">{semester.name}</CardTitle>
                                  <div className="text-right">
                                    <div className="text-sm text-muted-foreground">
                                      {semester.startDate} - {semester.endDate}
                                    </div>
                                    <div className="text-xl font-bold mt-1">
                                      Semester GPA: {semester.gpa.toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-sm text-muted-foreground mb-4">Courses</h4>
                                  {semester.subjects.map((subject, subIndex) => (
                                    <div
                                      key={subIndex}
                                      className="flex items-center justify-between p-4 rounded-lg border-2 bg-muted/50"
                                    >
                                      <div className="flex-1">
                                        <div className="font-medium text-base">{subject.name}</div>
                                        <div className="text-sm text-muted-foreground mt-1">{subject.code}</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-xl font-bold">{subject.grade}</div>
                                        <div className="text-sm text-muted-foreground">{subject.credits} credits</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Skills and Interests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t-2">
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Technical Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {user!.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Career Interests</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">{user!.interests}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Application History</CardTitle>
              <CardDescription className="text-base mt-1">
                View all internship applications for this student
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudentApplications userId={params.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Security Settings</CardTitle>
              <CardDescription className="text-base mt-1">Manage student security and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="resetPassword" className="text-base font-semibold">
                  Reset Password
                </Label>
                <div className="flex gap-3">
                  <Button variant="outline" className="w-full bg-transparent h-11">
                    Send Reset Link
                  </Button>
                  <Button className="w-full h-11">Generate Temporary Password</Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Two-Factor Authentication</Label>
                <div className="flex items-center justify-between rounded-lg border-2 p-5">
                  <div className="space-y-1">
                    <div className="font-medium text-base">2FA Status</div>
                    <div className="text-sm text-muted-foreground">
                      {user!.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                  <Button variant={user!.twoFactorEnabled ? "destructive" : "outline"} size="default">
                    {user!.twoFactorEnabled ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const users = [
  {
    id: "1",
    name: "Sarah",
    surname: "Johnson",
    email: "sarah.johnson@student.edu",
    university: "MIT",
    phone: "+1 617 234 5678",
    status: "Active",
    profilePicture: "/professional-woman-diverse.png",
    overallGPA: 3.85,
    yearOfStudy: "Junior",
    universityStartYear: "2023",
    graduationYear: "2026",
    major: "Computer Science",
    minor: "Business Administration",
    skills: ["JavaScript", "Python", "React", "Node.js", "Machine Learning"],
    interests: "Software development and AI applications in healthcare technology",
    twoFactorEnabled: false,
    academicRecords: [
      {
        year: "First Year",
        yearGPA: 3.72,
        semesters: [
          {
            name: "Fall 2023",
            startDate: "Sep 2023",
            endDate: "Dec 2023",
            gpa: 3.65,
            subjects: [
              { name: "Introduction to Computer Science", code: "CS101", grade: "A-", credits: 4 },
              { name: "Calculus I", code: "MATH101", grade: "B+", credits: 4 },
              { name: "Physics I", code: "PHYS101", grade: "B+", credits: 4 },
              { name: "English Composition", code: "ENG101", grade: "A", credits: 3 },
            ],
          },
          {
            name: "Spring 2024",
            startDate: "Jan 2024",
            endDate: "May 2024",
            gpa: 3.79,
            subjects: [
              { name: "Data Structures", code: "CS102", grade: "A", credits: 4 },
              { name: "Calculus II", code: "MATH102", grade: "A-", credits: 4 },
              { name: "Physics II", code: "PHYS102", grade: "B+", credits: 4 },
              { name: "Introduction to Business", code: "BUS101", grade: "A", credits: 3 },
            ],
          },
        ],
      },
      {
        year: "Second Year",
        yearGPA: 3.88,
        semesters: [
          {
            name: "Fall 2024",
            startDate: "Sep 2024",
            endDate: "Dec 2024",
            gpa: 3.85,
            subjects: [
              { name: "Algorithms", code: "CS201", grade: "A", credits: 4 },
              { name: "Linear Algebra", code: "MATH201", grade: "A-", credits: 4 },
              { name: "Database Systems", code: "CS202", grade: "A", credits: 4 },
              { name: "Microeconomics", code: "ECON201", grade: "B+", credits: 3 },
            ],
          },
          {
            name: "Spring 2025",
            startDate: "Jan 2025",
            endDate: "May 2025",
            gpa: 3.91,
            subjects: [
              { name: "Operating Systems", code: "CS203", grade: "A", credits: 4 },
              { name: "Probability & Statistics", code: "MATH202", grade: "A", credits: 4 },
              { name: "Web Development", code: "CS204", grade: "A", credits: 4 },
              { name: "Marketing Fundamentals", code: "BUS201", grade: "A-", credits: 3 },
            ],
          },
        ],
      },
      {
        year: "Third Year",
        yearGPA: 3.95,
        semesters: [
          {
            name: "Fall 2025",
            startDate: "Sep 2025",
            endDate: "Dec 2025",
            gpa: 3.92,
            subjects: [
              { name: "Machine Learning", code: "CS301", grade: "A", credits: 4 },
              { name: "Computer Networks", code: "CS302", grade: "A", credits: 4 },
              { name: "Software Engineering", code: "CS303", grade: "A-", credits: 4 },
              { name: "Business Strategy", code: "BUS301", grade: "A", credits: 3 },
            ],
          },
          {
            name: "Spring 2026",
            startDate: "Jan 2026",
            endDate: "May 2026",
            gpa: 3.98,
            subjects: [
              { name: "Artificial Intelligence", code: "CS304", grade: "A", credits: 4 },
              { name: "Distributed Systems", code: "CS305", grade: "A", credits: 4 },
              { name: "Capstone Project", code: "CS399", grade: "A", credits: 4 },
              { name: "Entrepreneurship", code: "BUS302", grade: "A", credits: 3 },
            ],
          },
        ],
      },
    ],
  },
]
