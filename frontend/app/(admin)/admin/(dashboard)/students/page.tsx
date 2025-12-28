"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, UserCog, ChevronLeft, ChevronRight, Download, Filter } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [universityFilter, setUniversityFilter] = useState<string>("all")
  const itemsPerPage = 10

  const filteredUsers = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.university.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || student.status === statusFilter
    const matchesUniversity = universityFilter === "all" || student.university === universityFilter

    return matchesSearch && matchesStatus && matchesUniversity
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const handleExport = () => {
    const csvContent = [
      ["Name", "Email", "University", "Phone", "Status"],
      ...filteredUsers.map((u) => [`${u.name} ${u.surname}`, u.email, u.university, u.phone, u.status]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "students.csv"
    a.click()
  }

  const universities = Array.from(new Set(students.map((u) => u.university)))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage student profiles and applications</p>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
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
                  <DropdownMenuLabel>Filter by University</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={universityFilter === "all"}
                    onCheckedChange={() => setUniversityFilter("all")}
                  >
                    All Universities
                  </DropdownMenuCheckboxItem>
                  {universities.map((uni) => (
                    <DropdownMenuCheckboxItem
                      key={uni}
                      checked={universityFilter === uni}
                      onCheckedChange={() => setUniversityFilter(uni)}
                    >
                      {uni}
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name} {student.surname}
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.university}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          student.status === "Active"
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                            : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                        }`}
                      >
                        {student.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/students/${student.id}`}>
                          <UserCog className="h-4 w-4" />
                          <span className="sr-only">View student</span>
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
              {filteredUsers.length} students
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

const students = [
  {
    id: "1",
    name: "Sarah",
    surname: "Johnson",
    email: "sarah.johnson@student.edu",
    university: "MIT",
    phone: "+1 617 234 5678",
    status: "Active",
  },
  {
    id: "2",
    name: "Michael",
    surname: "Chen",
    email: "michael.chen@student.edu",
    university: "Stanford",
    phone: "+1 650 345 6789",
    status: "Active",
  },
  {
    id: "3",
    name: "Emma",
    surname: "Williams",
    email: "emma.williams@student.edu",
    university: "Harvard",
    phone: "+1 617 456 7890",
    status: "Active",
  },
  {
    id: "4",
    name: "David",
    surname: "Brown",
    email: "david.brown@student.edu",
    university: "Berkeley",
    phone: "+1 510 567 8901",
    status: "Pending",
  },
  {
    id: "5",
    name: "Olivia",
    surname: "Davis",
    email: "olivia.davis@student.edu",
    university: "Yale",
    phone: "+1 203 678 9012",
    status: "Active",
  },
  {
    id: "6",
    name: "James",
    surname: "Miller",
    email: "james.miller@student.edu",
    university: "Princeton",
    phone: "+1 609 789 0123",
    status: "Active",
  },
  {
    id: "7",
    name: "Sophia",
    surname: "Garcia",
    email: "sophia.garcia@student.edu",
    university: "Columbia",
    phone: "+1 212 890 1234",
    status: "Pending",
  },
  {
    id: "8",
    name: "Daniel",
    surname: "Martinez",
    email: "daniel.martinez@student.edu",
    university: "Cornell",
    phone: "+1 607 901 2345",
    status: "Active",
  },
  {
    id: "9",
    name: "Ava",
    surname: "Rodriguez",
    email: "ava.rodriguez@student.edu",
    university: "MIT",
    phone: "+1 617 345 6789",
    status: "Active",
  },
  {
    id: "10",
    name: "William",
    surname: "Lopez",
    email: "william.lopez@student.edu",
    university: "Stanford",
    phone: "+1 650 456 7890",
    status: "Active",
  },
  {
    id: "11",
    name: "Isabella",
    surname: "Anderson",
    email: "isabella.anderson@student.edu",
    university: "Harvard",
    phone: "+1 617 567 8901",
    status: "Active",
  },
  {
    id: "12",
    name: "Ethan",
    surname: "Thomas",
    email: "ethan.thomas@student.edu",
    university: "Berkeley",
    phone: "+1 510 678 9012",
    status: "Pending",
  },
  {
    id: "13",
    name: "Mia",
    surname: "Taylor",
    email: "mia.taylor@student.edu",
    university: "Yale",
    phone: "+1 203 789 0123",
    status: "Active",
  },
  {
    id: "14",
    name: "Alexander",
    surname: "Moore",
    email: "alexander.moore@student.edu",
    university: "Princeton",
    phone: "+1 609 890 1234",
    status: "Active",
  },
  {
    id: "15",
    name: "Charlotte",
    surname: "Jackson",
    email: "charlotte.jackson@student.edu",
    university: "Columbia",
    phone: "+1 212 901 2345",
    status: "Active",
  },
  {
    id: "16",
    name: "Benjamin",
    surname: "White",
    email: "benjamin.white@student.edu",
    university: "Cornell",
    phone: "+1 607 012 3456",
    status: "Pending",
  },
  {
    id: "17",
    name: "Amelia",
    surname: "Harris",
    email: "amelia.harris@student.edu",
    university: "MIT",
    phone: "+1 617 123 4567",
    status: "Active",
  },
  {
    id: "18",
    name: "Lucas",
    surname: "Martin",
    email: "lucas.martin@student.edu",
    university: "Stanford",
    phone: "+1 650 234 5678",
    status: "Active",
  },
  {
    id: "19",
    name: "Harper",
    surname: "Thompson",
    email: "harper.thompson@student.edu",
    university: "Harvard",
    phone: "+1 617 345 6789",
    status: "Active",
  },
  {
    id: "20",
    name: "Henry",
    surname: "Garcia",
    email: "henry.garcia@student.edu",
    university: "Berkeley",
    phone: "+1 510 456 7890",
    status: "Active",
  },
  {
    id: "21",
    name: "Evelyn",
    surname: "Martinez",
    email: "evelyn.martinez@student.edu",
    university: "Yale",
    phone: "+1 203 567 8901",
    status: "Pending",
  },
  {
    id: "22",
    name: "Sebastian",
    surname: "Robinson",
    email: "sebastian.robinson@student.edu",
    university: "Princeton",
    phone: "+1 609 678 9012",
    status: "Active",
  },
  {
    id: "23",
    name: "Abigail",
    surname: "Clark",
    email: "abigail.clark@student.edu",
    university: "Columbia",
    phone: "+1 212 789 0123",
    status: "Active",
  },
  {
    id: "24",
    name: "Jack",
    surname: "Rodriguez",
    email: "jack.rodriguez@student.edu",
    university: "Cornell",
    phone: "+1 607 890 1234",
    status: "Active",
  },
  {
    id: "25",
    name: "Emily",
    surname: "Lewis",
    email: "emily.lewis@student.edu",
    university: "MIT",
    phone: "+1 617 901 2345",
    status: "Pending",
  },
]
