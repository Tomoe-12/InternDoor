import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export function CompanyPositions({ companyId }: { companyId: string }) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Viewing company positions as admin. Companies manage their own postings.
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((position) => (
              <TableRow key={position.id}>
                <TableCell className="font-medium">{position.title}</TableCell>
                <TableCell>{position.department}</TableCell>
                <TableCell>{position.type}</TableCell>
                <TableCell>{position.duration}</TableCell>
                <TableCell>{position.applications}</TableCell>
                <TableCell>
                  <Badge variant={position.status === "Open" ? "default" : "secondary"}>{position.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

const positions = [
  {
    id: "1",
    title: "Software Engineering Intern",
    department: "Engineering",
    type: "Full-time",
    duration: "3 months",
    applications: 45,
    status: "Open",
  },
  {
    id: "2",
    title: "Product Management Intern",
    department: "Product",
    type: "Full-time",
    duration: "6 months",
    applications: 32,
    status: "Open",
  },
  {
    id: "3",
    title: "Data Science Intern",
    department: "Analytics",
    type: "Full-time",
    duration: "3 months",
    applications: 67,
    status: "Open",
  },
  {
    id: "4",
    title: "UX Design Intern",
    department: "Design",
    type: "Part-time",
    duration: "4 months",
    applications: 28,
    status: "Closed",
  },
  {
    id: "5",
    title: "Marketing Intern",
    department: "Marketing",
    type: "Full-time",
    duration: "3 months",
    applications: 41,
    status: "Open",
  },
]
