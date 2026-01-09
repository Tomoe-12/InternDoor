"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Globe, Phone, Mail, MapPin, Linkedin, Clock, Edit2, Save, X } from "lucide-react"

export default function ProfileSettingsPage() {
  const [isEditing, setIsEditing] = useState(false)

  const [companyData, setCompanyData] = useState({
    company_name: "SanShin",
    website: "https://khunthihan.vercel.app/",
    phone_number: "+959785146940",
    company_email: "li8993han@gmail.com",
    industry: "manufacturing",
    organization_size: "201-500",
    organization_type: "nonprofit",
    logo: "https://utfs.io/f/1yw5oXpdM86u2yCkgk5hFRS4DPpWzC17Bm5c8wQH3kOAqn0T",
    address: "Online Only",
    description: "online",
    operating_hours: {
      Monday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
      Tuesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
      Wednesday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
      Thursday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
      Friday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
      Saturday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
      Sunday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
    },
    linkedin_profile: "https://www.linkedin.com/in/khun-thi-han-b698a0382/",
  })

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your organization information</p>
        </div>
        <Button variant={isEditing ? "outline" : "default"} onClick={() => setIsEditing(!isEditing)} className="gap-2">
          {isEditing ? (
            <>
              <X className="h-4 w-4" /> Cancel
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4" /> Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Basic information about your company</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> Company Name
                  </Label>
                  <Input value={companyData.company_name} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4" /> Website
                  </Label>
                  <Input value={companyData.website} disabled={!isEditing} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Phone Number
                  </Label>
                  <Input value={companyData.phone_number} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </Label>
                  <Input value={companyData.company_email} disabled={!isEditing} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Input value={companyData.industry} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label>Size</Label>
                  <Input value={companyData.organization_size} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Input value={companyData.organization_type} disabled={!isEditing} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Address
                </Label>
                <Input value={companyData.address} disabled={!isEditing} />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={companyData.description} disabled={!isEditing} rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" /> Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(companyData.operating_hours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                    <span className="font-medium w-24">{day}</span>
                    <div>
                      {hours.isOpen ? (
                        <span className="text-sm text-muted-foreground">
                          {hours.openTime} - {hours.closeTime}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Closed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={companyData.logo || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">SS</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{companyData.company_name}</h2>
                <p className="text-sm text-muted-foreground">{companyData.industry}</p>
              </div>
              {isEditing && (
                <Button variant="outline" className="w-full bg-transparent">
                  Change Logo
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Linkedin className="h-4 w-4" /> LinkedIn Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input value={companyData.linkedin_profile} disabled={!isEditing} />
            </CardContent>
          </Card>

          {isEditing && (
            <Button size="lg" className="w-full gap-2" onClick={() => setIsEditing(false)}>
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
