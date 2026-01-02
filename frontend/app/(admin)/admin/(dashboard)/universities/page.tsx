"use client"

import {  Suspense } from "react" 
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
