import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function StudentApplications({ studentId }: { studentId: string }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">{application.company}</TableCell>
              <TableCell>{application.position}</TableCell>
              <TableCell>{application.dateApplied}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    application.status === "Accepted"
                      ? "default"
                      : application.status === "Under Review"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {application.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

const applications = [
  {
    id: "1",
    company: "Tech Innovations Ltd",
    position: "Software Engineering Intern",
    dateApplied: "2024-11-15",
    status: "Under Review",
  },
  {
    id: "2",
    company: "Digital Solutions Inc",
    position: "Frontend Developer Intern",
    dateApplied: "2024-11-10",
    status: "Accepted",
  },
  {
    id: "3",
    company: "Future Systems Corp",
    position: "Data Science Intern",
    dateApplied: "2024-11-05",
    status: "Rejected",
  },
  {
    id: "4",
    company: "Creative Dynamics",
    position: "UX Design Intern",
    dateApplied: "2024-10-28",
    status: "Under Review",
  },
  {
    id: "5",
    company: "Global Enterprises",
    position: "Marketing Intern",
    dateApplied: "2024-10-20",
    status: "Accepted",
  },
]
