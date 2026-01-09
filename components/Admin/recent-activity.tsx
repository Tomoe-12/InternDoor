import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BriefcaseIcon, UserCheck } from "lucide-react"

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9 border">
            {activity.type === "match" ? (
              <UserCheck className="h-4 w-4 text-green-500" />
            ) : (
              <BriefcaseIcon className="h-4 w-4 text-blue-500" />
            )}
            <AvatarFallback>{activity.student[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.student}</p>
            <p className="text-sm text-muted-foreground">{activity.company}</p>
          </div>
          <div
            className={`ml-auto text-xs font-medium ${activity.type === "match" ? "text-green-500" : "text-blue-500"}`}
          >
            {activity.type === "match" ? "Matched" : "Applied"}
          </div>
        </div>
      ))}
    </div>
  )
}

const activities = [
  {
    id: "1",
    student: "Sarah Johnson",
    company: "Tech Innovations Ltd",
    type: "match",
  },
  {
    id: "2",
    student: "Michael Chen",
    company: "Digital Solutions Inc",
    type: "application",
  },
  {
    id: "3",
    student: "Emma Williams",
    company: "Future Systems Corp",
    type: "match",
  },
  {
    id: "4",
    student: "David Brown",
    company: "Creative Dynamics",
    type: "application",
  },
  {
    id: "5",
    student: "Olivia Davis",
    company: "Global Enterprises",
    type: "match",
  },
]
