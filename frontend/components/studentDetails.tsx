"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  UserCog,
  GraduationCap,
  BriefcaseIcon,
  Shield,
  Download,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentApplications } from "@/components/Admin/student-applications";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/lib/auth/use-auth";

// Types for student academic data
interface Subject {
  code: string;
  name: string;
  grade: string;
  credits: number;
}

interface Semester {
  name: string;
  startDate: string;
  endDate: string;
  gpa: number;
  subjects: Subject[];
}

interface AcademicRecord {
  year: string | number;
  yearGPA: number;
  semesters: Semester[];
}

interface Student {
  name: string;
  surname: string;
  email: string;
  phone: string;
  university: string;
  status: string;
  profilePicture?: string;
  overallGPA: number;
  yearOfStudy: number | string;
  major: string;
  minor?: string;
  universityStartYear: number | string;
  graduationYear: number | string;
  academicRecords: AcademicRecord[];
  skills: string[];
  interests: string;
  twoFactorEnabled: boolean;
}

const StudentDetails = ({ student, id }: { student: Student; id: string }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAcademic, setIsEditingAcademic] = useState(false);
  const [tab, setTab] = useState<string>("profile");
  const router = useRouter();
  const { user } = useAuthGuard({ middleware: "auth" });

  console.log("userdata", user?.role);

  const handleExportGPA = () => {
    const csvContent = [
      [
        "Year",
        "Semester",
        "Start Date",
        "End Date",
        "GPA",
        "Course Code",
        "Course Name",
        "Grade",
        "Credits",
      ],
      ...student!.academicRecords.flatMap((record: AcademicRecord) =>
        record.semesters.flatMap((semester: Semester) =>
          semester.subjects.map((subject: Subject) => [
            record.year,
            semester.name,
            semester.startDate,
            semester.endDate,
            semester.gpa.toFixed(2),
            subject.code,
            subject.name,
            subject.grade,
            subject.credits,
          ])
        )
      ),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${student!.name}_${student!.surname}_GPA_Report.csv`;
    a.click();
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 pb-8 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 ">
        <div className="flex items-start gap-3">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="icon"
            className="mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {student!.name} {student!.surname}
            </h1>
            <p className="text-muted-foreground text-base mt-1">
              Student profile and application management
            </p>
          </div>
        </div>
        <div className=" flex items-center justify-center bg-red-5">
          <Avatar className="h-44 w-44 md:h-24 md:w-24 border-4 border-background shadow-lg ">
            <AvatarImage
              src={student!.profilePicture || "/placeholder.svg"}
              alt={`${student!.name} ${student!.surname}`}
            />
            <AvatarFallback className="text-2xl font-semibold">
              {student!.name[0]}
              {student!.surname[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <Tabs
        value={tab}
        onValueChange={setTab}
        defaultValue="profile"
        className="space-y-6"
      >
        <TabsList className="h-12 hidden sm:flex justify-start w-fit px-2">
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
          {user?.role.toUpperCase() === "ADMIN" && (
            <TabsTrigger value="security" className="text-base px-6">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          )}
        </TabsList>

        <div className="sm:hidden">
          <Label className="text-sm mb-2 block">Section</Label>
          <Select value={tab} onValueChange={setTab}>
            <SelectTrigger className="h-11 text-base">
              <SelectValue placeholder="Choose a section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="profile">Profile</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="applications">Applications</SelectItem>
              {user?.role?.toUpperCase() === "ADMIN" && (
                <SelectItem value="security">Security</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <div>
                <CardTitle className="text-2xl">Profile Information</CardTitle>
                <CardDescription className="text-base mt-1">
                  View and update student profile details
                </CardDescription>
              </div>
              {user?.role.toUpperCase() === "ADMIN" && (
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
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-base">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    defaultValue={student!.name}
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
                    defaultValue={student!.surname}
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
                    defaultValue={student!.email}
                    disabled={!isEditingProfile}
                    className="h-11 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-base">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    defaultValue={student!.phone}
                    disabled={!isEditingProfile}
                    className="h-11 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="university" className="text-base">
                    University
                  </Label>
                  <Input
                    id="university"
                    defaultValue={student!.university}
                    disabled={!isEditingProfile}
                    className="h-11 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="status" className="text-base">
                    Account Status
                  </Label>
                  <Select
                    defaultValue={student!.status}
                    disabled={!isEditingProfile}
                  >
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
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsEditingProfile(false)}
                >
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
            <CardHeader className="grid grid-cols-1 md:grid-cols-2 space-y-4 md:space-y-0 items-center justify-between pb-6">
              <div>
                <CardTitle className="text-2xl">Academic Performance</CardTitle>
                <CardDescription className="text-base mt-1">
                  Complete academic history and performance records
                </CardDescription>
              </div>
              <div className="flex justify-end items-center gap-3">
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleExportGPA}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                {user?.role.toUpperCase() === "ADMIN" && (
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
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Overall GPA
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">
                      {student!.overallGPA.toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Out of 4.0
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Current Year
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">
                      {student!.yearOfStudy}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Year of study
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Major
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{student!.major}</div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {student!.minor && `Minor: ${student!.minor}`}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      University Period
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {student!.universityStartYear} - {student!.graduationYear}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Start - Graduation
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Academic Records by Year
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {student.academicRecords.map(
                    (record: AcademicRecord, index: number) => (
                      <AccordionItem
                        key={index}
                        value={`year-${index}`}
                        className="border-2 rounded-lg mb-4 px-4"
                      >
                        <AccordionTrigger className="hover:no-underline py-5">
                          <div className="flex items-center justify-between w-full pr-4">
                            <span className="font-semibold text-lg">
                              {record.year}
                            </span>
                            <Badge
                              variant="secondary"
                              className="ml-auto mr-4 text-sm px-3 py-1"
                            >
                              Yearly GPA: {record.yearGPA.toFixed(2)}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-6 pt-4 pb-2">
                            {record.semesters.map(
                              (semester: Semester, semIndex: number) => (
                                <Card key={semIndex} className="border-2">
                                  <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                      <CardTitle className="text-lg">
                                        {semester.name}
                                      </CardTitle>
                                      <div className="text-right">
                                        <div className="text-sm text-muted-foreground">
                                          {semester.startDate} -{" "}
                                          {semester.endDate}
                                        </div>
                                        <div className="text-xl font-bold mt-1">
                                          Semester GPA:{" "}
                                          {semester.gpa.toFixed(2)}
                                        </div>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-sm text-muted-foreground mb-4">
                                        Courses
                                      </h4>
                                      {semester.subjects.map(
                                        (
                                          subject: Subject,
                                          subIndex: number
                                        ) => (
                                          <div
                                            key={subIndex}
                                            className="flex items-center justify-between p-4 rounded-lg border-2 bg-muted/50"
                                          >
                                            <div className="flex-1">
                                              <div className="font-medium text-base">
                                                {subject.name}
                                              </div>
                                              <div className="text-sm text-muted-foreground mt-1">
                                                {subject.code}
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <div className="text-xl font-bold">
                                                {subject.grade}
                                              </div>
                                              <div className="text-sm text-muted-foreground">
                                                {subject.credits} credits
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              )
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  )}
                </Accordion>
              </div>

              {/* Skills and Interests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t-2">
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Technical Skills
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {student!.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-sm px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Career Interests
                  </Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {student!.interests}
                  </p>
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
              <StudentApplications studentId={id} />
            </CardContent>
          </Card>
        </TabsContent>
        {user?.role.toUpperCase() === "ADMIN" && (
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl">Security Settings</CardTitle>
                <CardDescription className="text-base mt-1">
                  Manage student security and access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 ">
                <div className="space-y-3">
                  <Label
                    htmlFor="resetPassword"
                    className="text-base font-semibold"
                  >
                    Reset Password
                  </Label>
                  <div className="grid gap-3 grid-cols-1 space-y-2 md:grid-cols-2 md:space-y-0 ">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent h-11"
                    >
                      Send Reset Link
                    </Button>
                    <Button className="w-full h-11">
                      Generate Temporary Password
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Two-Factor Authentication
                  </Label>
                  <div className="flex items-center justify-between rounded-lg border-2 p-5">
                    <div className="space-y-1">
                      <div className="font-medium text-base">2FA Status</div>
                      <div className="text-sm text-muted-foreground">
                        {student!.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </div>
                    </div>
                    <Button
                      variant={
                        student!.twoFactorEnabled ? "destructive" : "outline"
                      }
                      size="default"
                    >
                      {student!.twoFactorEnabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default StudentDetails;
