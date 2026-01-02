"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Building2, ChevronLeft, ChevronRight, Download, Filter } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function CompaniesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [industryFilter, setIndustryFilter] = useState<string>("all")
  const itemsPerPage = 10

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || company.status === statusFilter
    const matchesIndustry = industryFilter === "all" || company.industry === industryFilter

    return matchesSearch && matchesStatus && matchesIndustry
  })

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage)

  const handleExport = () => {
    const csvContent = [
      ["Company Name", "Industry", "Open Positions", "Location", "Status"],
      ...filteredCompanies.map((c) => [c.name, c.industry, c.openPositions.toString(), c.location, c.status]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "companies.csv"
    a.click()
  }

  const industries = Array.from(new Set(companies.map((c) => c.industry)))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">Manage company profiles and internship postings</p>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                className="h-9"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={statusFilter === "all"}
                    onCheckedChange={() => setStatusFilter("all")}
                  >
                    All Status
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter === "Active"}
                    onCheckedChange={() => setStatusFilter("Active")}
                  >
                    Active
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter === "Pending"}
                    onCheckedChange={() => setStatusFilter("Pending")}
                  >
                    Pending
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Industry</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={industryFilter === "all"}
                    onCheckedChange={() => setIndustryFilter("all")}
                  >
                    All Industries
                  </DropdownMenuCheckboxItem>
                  {industries.map((industry) => (
                    <DropdownMenuCheckboxItem
                      key={industry}
                      checked={industryFilter === industry}
                      onCheckedChange={() => setIndustryFilter(industry)}
                    >
                      {industry}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          <div className="w-full min-w-[640px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Open Positions</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={company.logo || "/placeholder.svg"} alt={company.name} />
                          <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{company.industry}</TableCell>
                    <TableCell>{company.openPositions}</TableCell>
                    <TableCell>{company.location}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          company.status === "Active"
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                            : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                        }`}
                      >
                        {company.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`companies/${company.id}`}>
                          <Building2 className="h-4 w-4" />
                          <span className="sr-only">View company</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCompanies.length)} of{" "}
              {filteredCompanies.length} companies
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

const companies = [
  {
    id: "1",
    name: "Tech Innovations Ltd",
    industry: "Technology",
    openPositions: 8,
    location: "San Francisco, CA",
    status: "Active",
    logo: "/tech-company-logo.jpg",
  },
  {
    id: "2",
    name: "Digital Solutions Inc",
    industry: "Software",
    openPositions: 5,
    location: "New York, NY",
    status: "Active",
    logo: "/software-company-logo.png",
  },
  {
    id: "3",
    name: "Future Systems Corp",
    industry: "IT Services",
    openPositions: 12,
    location: "Boston, MA",
    status: "Active",
    logo: "/abstract-tech-logo.png",
  },
  {
    id: "4",
    name: "Creative Dynamics",
    industry: "Design",
    openPositions: 3,
    location: "Los Angeles, CA",
    status: "Pending",
    logo: "/generic-company-logo.png",
  },
  {
    id: "5",
    name: "Global Enterprises",
    industry: "Consulting",
    openPositions: 15,
    location: "Chicago, IL",
    status: "Active",
    logo: "/consulting-company-logo.png",
  },
]
