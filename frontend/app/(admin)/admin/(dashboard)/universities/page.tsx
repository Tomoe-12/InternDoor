"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Users, School, Plus, Filter, LayoutGrid, List } from "lucide-react"
import Link from "next/link"
import { useState, Suspense } from "react" // added Suspense import

const universities = [
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    shortName: "MIT",
    location: "Cambridge, MA",
    students: 11520,
    status: "Active",
    type: "Private",
    logo: "https://v0.blob.com/logos/mit.png",
    description: "A world-renowned research university known for its programs in physical sciences and engineering.",
  },
  {
    id: "stanford",
    name: "Stanford University",
    shortName: "Stanford",
    location: "Stanford, CA",
    students: 17249,
    status: "Active",
    type: "Private",
    logo: "https://v0.blob.com/logos/stanford.png",
    description: "One of the world's leading teaching and research institutions, located in Silicon Valley.",
  },
  {
    id: "harvard",
    name: "Harvard University",
    shortName: "Harvard",
    location: "Cambridge, MA",
    students: 23731,
    status: "Active",
    type: "Private",
    logo: "https://v0.blob.com/logos/harvard.png",
    description: "The oldest institution of higher learning in the United States.",
  },
  {
    id: "berkeley",
    name: "University of California, Berkeley",
    shortName: "UC Berkeley",
    location: "Berkeley, CA",
    students: 45036,
    status: "Active",
    type: "Public",
    logo: "https://v0.blob.com/logos/berkeley.png",
    description: "A premier public research university known for its academic excellence and social activism.",
  },
]

function UniversitiesContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredUnis = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Universities</h1>
          <p className="text-muted-foreground">Manage affiliated higher education institutions</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add University
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search universities..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 ml-auto w-full sm:w-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-muted" : ""}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-muted" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div
        className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}
      >
        {filteredUnis.map((uni) => (
          <Link key={uni.id} href={`/admin/universities/${uni.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-3">
                    <School className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <Badge
                    variant={uni.status === "Active" ? "secondary" : "outline"}
                    className="bg-green-500/10 text-green-500 border-none"
                  >
                    {uni.status}
                  </Badge>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">{uni.name}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {uni.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{uni.description}</p>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {uni.students.toLocaleString()} Students
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="font-normal">
                      {uni.type}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function UniversitiesPage() {
  return (
    <Suspense fallback={null}>
      <UniversitiesContent />
    </Suspense>
  )
}
