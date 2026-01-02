"use client"

import UniversityDetails from "@/components/common/universityDetails"
import { use } from "react"


export default function UniversityDetailPage({ params }: { params: Promise<{ university_id: string }> }) {
  const { university_id } = use(params)
  // Mock data fetching based on ID


  return (
   <UniversityDetails university_id={university_id} />
  )
}
