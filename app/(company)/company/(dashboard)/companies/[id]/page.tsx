"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Building2,
  BriefcaseIcon,
  Users,
  Shield,
  Edit,
  Save,
  X,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CompanyPositions } from "@/components/company/company-positions"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CompanyProfilePage({ params }: { params: { id: string } }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const company = companies.find((c) => c.id === params.id) || companies[0]

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" asChild className="mt-1">
            <Link href="/companies">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{company.name}</h1>
            <p className="text-muted-foreground text-base mt-1">Company profile and position management</p>
          </div>
        </div>
        <Avatar className="h-24 w-24 rounded-xl border-4 border-background shadow-lg">
          <AvatarImage src={company.logo || "/placeholder.svg"} alt={company.name} className="object-cover" />
          <AvatarFallback className="text-2xl font-semibold rounded-xl">
            {company.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="h-12">
          <TabsTrigger value="profile" className="text-base px-6">
            <Building2 className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="positions" className="text-base px-6">
            <BriefcaseIcon className="h-4 w-4 mr-2" />
            Positions
          </TabsTrigger>
          <TabsTrigger value="applicants" className="text-base px-6">
            <Users className="h-4 w-4 mr-2" />
            Applicants
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
                <CardTitle className="text-2xl">Company Information</CardTitle>
                <CardDescription className="text-base mt-1">View and update company profile details</CardDescription>
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
                  <Label htmlFor="companyName" className="text-base">
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    defaultValue={company.name}
                    disabled={!isEditingProfile}
                    className="h-11 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="industry" className="text-base">
                    Industry
                  </Label>
                  <Input
                    id="industry"
                    defaultValue={company.industry}
                    disabled={!isEditingProfile}
                    className="h-11 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="location" className="text-base">
                    Location
                  </Label>
                  <Input
                    id="location"
                    defaultValue={company.location}
                    disabled={!isEditingProfile}
                    className="h-11 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="website" className="text-base">
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    defaultValue={company.website}
                    disabled={!isEditingProfile}
                    className="h-11 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="employees" className="text-base">
                    Number of Employees
                  </Label>
                  <Input
                    id="employees"
                    defaultValue={company.employees}
                    disabled={!isEditingProfile}
                    className="h-11 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="status" className="text-base">
                    Account Status
                  </Label>
                  <Select defaultValue={company.status} disabled={!isEditingProfile}>
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

              <div className="space-y-3">
                <Label htmlFor="description" className="text-base">
                  Company Description
                </Label>
                <Textarea
                  id="description"
                  defaultValue={company.description}
                  rows={5}
                  disabled={!isEditingProfile}
                  className="text-base resize-none"
                />
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

        <TabsContent value="positions" className="mt-6">
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Open Positions</CardTitle>
              <CardDescription className="text-base mt-1">
                View company internship and job postings (read-only for admin)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyPositions companyId={params.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applicants" className="mt-6">
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Applicant Overview</CardTitle>
              <CardDescription className="text-base mt-1">
                Comprehensive statistics for all applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <BriefcaseIcon className="h-4 w-4" />
                      Total Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{company.totalApplications}</div>
                    <p className="text-sm text-muted-foreground mt-2">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Under Review
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{company.underReview}</div>
                    <p className="text-sm text-muted-foreground mt-2">Pending decision</p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Accepted
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{company.accepted}</div>
                    <p className="text-sm text-muted-foreground mt-2">Successfully matched</p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Rejected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{company.rejected}</div>
                    <p className="text-sm text-muted-foreground mt-2">Not selected</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Security Settings</CardTitle>
              <CardDescription className="text-base mt-1">Manage company account security</CardDescription>
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
                      {company.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                  <Button variant={company.twoFactorEnabled ? "destructive" : "outline"} size="default">
                    {company.twoFactorEnabled ? "Disable" : "Enable"}
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

const companies = [
  {
    id: "1",
    name: "Tech Innovations Ltd",
    industry: "Technology",
    location: "San Francisco, CA",
    website: "https://techinnovations.com",
    employees: "500-1000",
    status: "Active",
    logo: "/tech-company-logo.jpg",
    description:
      "Leading technology company specializing in innovative software solutions and cutting-edge AI development.",
    totalApplications: 234,
    underReview: 45,
    accepted: 18,
    rejected: 171,
    twoFactorEnabled: true,
  },
  {
    id: "2",
    name: "Digital Solutions Inc",
    industry: "Software",
    location: "New York, NY",
    website: "https://digitalsolutions.com",
    employees: "200-500",
    status: "Active",
    logo: "/software-company-logo.png",
    description: "Digital transformation company helping businesses modernize their technology infrastructure.",
    totalApplications: 189,
    underReview: 32,
    accepted: 15,
    rejected: 142,
    twoFactorEnabled: true,
  },
  {
    id: "3",
    name: "Future Systems Corp",
    industry: "IT Services",
    location: "Boston, MA",
    website: "https://futuresystems.com",
    employees: "1000+",
    status: "Active",
    logo: "/abstract-tech-logo.png",
    description: "Enterprise IT services and consulting firm with a focus on cloud infrastructure and cybersecurity.",
    totalApplications: 456,
    underReview: 78,
    accepted: 34,
    rejected: 344,
    twoFactorEnabled: false,
  },
]
