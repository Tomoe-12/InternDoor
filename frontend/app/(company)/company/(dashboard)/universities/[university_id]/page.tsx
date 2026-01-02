"use client";

import { use } from "react";
import UniversityDetails from "@/components/common/universityDetails";

export default function UniversityDetailPage({
  params,
}: {
  params: Promise<{ university_id: string }>;
}) {
  const { university_id } = use(params);

  return <UniversityDetails university_id={university_id} />;
}
