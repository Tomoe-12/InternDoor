"use client"

import { Suspense } from "react" // added Suspense import
import AllUniversity from "@/components/common/allUniversity"


function UniversitiesContent() {
 
  return (
   <AllUniversity/>
  )
}

export default function UniversitiesPage() {
  return (
    <Suspense fallback={null}>
      <UniversitiesContent />
    </Suspense>
  )
}
