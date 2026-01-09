"use client";

import { Suspense, use } from "react"; // Added Suspense import
import { useRouter } from "next/navigation";
import {UniversityAllStudents} from "@/components/common/";

export default function StudentsContent({
  params,
}: {
  params: Promise<{ university_id: string }>;
}) {
  const { university_id } = use(params);
  const router = useRouter();
  // Mock data for the specific university
  const universityName = "Massachusetts Institute of Technology";

  return (
    <Suspense fallback={null}>
      <UniversityAllStudents
        university_id={university_id}
        university_name={universityName}
      />
    </Suspense>
  );
}
