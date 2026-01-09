"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, MoreVertical, Mail, GraduationCap, Calendar, ChevronRight, Briefcase } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Suspense } from "react"
import { useRouter } from "next/navigation"

export default function ApplicantsPage() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/company/applicants/1')
  }
  return (
    <Suspense fallback={null}>
      <div className="flex flex-col gap-6 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applicants</h1>
          <p className="text-muted-foreground mt-1">Review student profiles and manage applications</p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search students..." className="pl-10" />
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Role
          </Button>
          <Button variant="outline">Status</Button>
        </div>

        <div className="grid gap-4">
          {[
            {
              name: "Alex Rivera",
              role: "Frontend Intern",
              university: "Stanford University",
              gpa: "3.9",
              applied: "Oct 12, 2025",
              status: "Interviewing",
              avatar: "AR",
            },
            {
              name: "Sophie Bennett",
              role: "UX Design Intern",
              university: "RISD",
              gpa: "3.8",
              applied: "Oct 10, 2025",
              status: "Reviewing",
              avatar: "SB",
            },
            {
              name: "Jordan Lee",
              role: "Frontend Intern",
              university: "MIT",
              gpa: "4.0",
              applied: "Oct 08, 2025",
              status: "Accepted",
              avatar: "JL",
            },
            {
              name: "Maya Patel",
              role: "Backend Intern",
              university: "UC Berkeley",
              gpa: "3.7",
              applied: "Oct 05, 2025",
              status: "Rejected",
              avatar: "MP",
            },
          ].map((applicant, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {applicant.avatar}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{applicant.name}</h4>
                        <Badge
                          variant={
                            applicant.status === "Accepted"
                              ? "default"
                              : applicant.status === "Rejected"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {applicant.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" /> {applicant.role}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-8">
                    <div className="text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                        <GraduationCap className="h-3.5 w-3.5" /> University
                      </div>
                      <span className="font-medium">{applicant.university}</span>
                    </div>
                    <div className="text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                        <Calendar className="h-3.5 w-3.5" /> Applied
                      </div>
                      <span className="font-medium">{applicant.applied}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button onClick={()=>handleClick()} variant="outline" className="gap-2 bg-transparent">
                      View Profile <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Suspense>
  )
}
