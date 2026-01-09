"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Users, Eye, Calendar, Plus, MapPin } from "lucide-react"
import { Suspense } from "react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem, // added DropdownMenuItem
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { toast } from "sonner" // added toast for feedback
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const INITIAL_JOBS = [
  {
    title: "Frontend Engineering Intern",
    department: "Engineering",
    location: "Remote",
    posted: "2 days ago",
    applicants: 42,
    views: 840,
    status: "Active",
    deadline: "Oct 15, 2025",
  },
  {
    title: "UX/UI Design Assistant",
    department: "Design",
    location: "San Francisco, CA",
    posted: "5 days ago",
    applicants: 38,
    views: 650,
    status: "Active",
    deadline: "Oct 20, 2025",
  },
  {
    title: "Data Science Intern",
    department: "Analytics",
    location: "Hybrid",
    posted: "1 week ago",
    applicants: 56,
    views: 1200,
    status: "Closed",
    deadline: "Expired",
  },
  {
    title: "Backend Developer Intern",
    department: "Engineering",
    location: "Austin, TX",
    posted: "3 days ago",
    applicants: 25,
    views: 400,
    status: "Active",
    deadline: "Oct 25, 2025",
  },
  {
    title: "Marketing Coordinator Intern",
    department: "Marketing",
    location: "Remote",
    posted: "4 days ago",
    applicants: 15,
    views: 300,
    status: "Active",
    deadline: "Oct 30, 2025",
  },
  {
    title: "Product Management Intern",
    department: "Product",
    location: "New York, NY",
    posted: "1 week ago",
    applicants: 60,
    views: 1500,
    status: "Closed",
    deadline: "Nov 1, 2025",
  },
  {
    title: "iOS Development Intern",
    department: "Engineering",
    location: "Remote",
    posted: "6 days ago",
    applicants: 20,
    views: 500,
    status: "Active",
    deadline: "Nov 5, 2025",
  },
  {
    title: "Cybersecurity Analyst Intern",
    department: "Security",
    location: "Washington, DC",
    posted: "1 day ago",
    applicants: 10,
    views: 200,
    status: "Active",
    deadline: "Nov 10, 2025",
  },
]

export default function JobPostingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCloseAlertDialogOpen, setIsCloseAlertDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<(typeof INITIAL_JOBS)[0] | null>(null)
  const [isViewListingOpen, setIsViewListingOpen] = useState(false)
  const [isViewApplicantsOpen, setIsViewApplicantsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredJobs = INITIAL_JOBS.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage)

  const statuses = Array.from(new Set(INITIAL_JOBS.map((j) => j.status)))

  return (
    <Suspense fallback={null}>
      <div className="flex flex-col gap-6 pb-8">
        <Dialog open={isViewListingOpen} onOpenChange={setIsViewListingOpen}>
          <DialogContent className="sm:max-w-[600px] bg-card border-border">
            <DialogHeader>
              <DialogTitle>{selectedJob?.title}</DialogTitle>
              <DialogDescription>
                Posted {selectedJob?.posted} • {selectedJob?.location}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Job Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We are looking for a passionate {selectedJob?.title} to join our team. This is a{" "}
                  {selectedJob?.location} position with a focus on delivering high-quality results and learning from
                  senior mentors.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Status</p>
                  <p className="text-sm font-medium">{selectedJob?.status}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Deadline</p>
                  <p className="text-sm font-medium">{selectedJob?.deadline}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewListingOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  toast.success("Redirecting to external job board...")
                  window.open(
                    "https://example.com/jobs/" + selectedJob?.title.toLowerCase().replace(/\s+/g, "-"),
                    "_blank",
                  )
                }}
              >
                View External Listing
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewApplicantsOpen} onOpenChange={setIsViewApplicantsOpen}>
          <DialogContent className="sm:max-w-[700px] bg-card border-border">
            <DialogHeader>
              <DialogTitle>Applicants for {selectedJob?.title}</DialogTitle>
              <DialogDescription>
                Reviewing all {selectedJob?.applicants} applicants for this position.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
              {Array.from({ length: selectedJob?.applicants || 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg bg-background/50 border-border hover:bg-background transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {String.fromCharCode(65 + (i % 26))}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Candidate {i + 1}</p>
                      <p className="text-xs text-muted-foreground">Applied {i + 1} day(s) ago • University Student</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-[10px] h-5">
                      GPA 3.{9 - (i % 3)}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-8">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter className="flex items-center justify-between border-t pt-4">
              <p className="text-xs text-muted-foreground">Total: {selectedJob?.applicants} Candidates</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsViewApplicantsOpen(false)}>
                  Close
                </Button>
                <Button>Download Batch</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[550px] bg-card border-border">
            <DialogHeader>
              <DialogTitle>Edit Job: {selectedJob?.title}</DialogTitle>
              <DialogDescription>Modify the internship details and save changes.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Job Title</Label>
                <Input id="edit-title" defaultValue={selectedJob?.title} className="bg-background border-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    defaultValue={selectedJob?.location}
                    className="bg-background border-border"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-deadline">Deadline</Label>
                  <Input
                    id="edit-deadline"
                    defaultValue={selectedJob?.deadline}
                    className="bg-background border-border"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.success("Job updated successfully")
                  setIsEditDialogOpen(false)
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isCloseAlertDialogOpen} onOpenChange={setIsCloseAlertDialogOpen}>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will mark the <strong>{selectedJob?.title}</strong> posting as closed. You can reactivate it later
                from the archived section.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-rose-600 hover:bg-rose-700 text-white"
                onClick={() => {
                  toast.success("Job posting closed")
                  setIsCloseAlertDialogOpen(false)
                }}
              >
                Yes, Close Posting
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Postings</h1>
            <p className="text-muted-foreground mt-1">Manage your internship listings and openings</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Posting
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-card border-border">
              <DialogHeader>
                <DialogTitle>Create New Posting</DialogTitle>
                <DialogDescription>Fill in the details to reach potential internship candidates.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Frontend Engineering Intern"
                    className="bg-background border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g. Remote / NYC" className="bg-background border-border" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deadline">Application Deadline</Label>
                    <Input id="deadline" type="date" className="bg-background border-border" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about the role, responsibilities, and requirements..."
                    className="min-h-[120px] bg-background border-border"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    console.log("[v0] New posting submitted")
                    setIsCreateDialogOpen(false)
                  }}
                >
                  Publish Posting
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search job titles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                {statusFilter === "all" ? "Status" : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilter === "all"}
                onCheckedChange={() => {
                  setStatusFilter("all")
                  setCurrentPage(1)
                }}
              >
                All Status
              </DropdownMenuCheckboxItem>
              {statuses.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilter === status}
                  onCheckedChange={() => {
                    setStatusFilter(status)
                    setCurrentPage(1)
                  }}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid gap-4">
          {paginatedJobs.length > 0 ? (
            paginatedJobs.map((job, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <Badge
                          className={cn(
                            job.status === "Active"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20"
                              : "bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 border-rose-500/20",
                          )}
                          variant="outline"
                        >
                          {job.status}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> Posted {job.posted}
                        </span>
                        <span>Deadline: {job.deadline}</span>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{job.applicants} applicants</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{job.views} views</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedJob(job)
                          setIsViewListingOpen(true)
                        }}
                      >
                        View Listing
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedJob(job)
                          setIsViewApplicantsOpen(true)
                        }}
                      >
                        View Applicants
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedJob(job)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            Edit Job
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-rose-500 focus:text-rose-500"
                            onClick={() => {
                              setSelectedJob(job)
                              setIsCloseAlertDialogOpen(true)
                            }}
                          >
                            Close Posting
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg border-border">
              <p className="text-muted-foreground">No job postings found matching your filters.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setCurrentPage(1)
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) setCurrentPage(currentPage - 1)
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(i + 1)
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </Suspense>
  )
}
