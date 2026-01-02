"use client";

import { Suspense, use } from "react"; // Added Suspense import
import { useRouter } from "next/navigation";
import UniverstiyAllStudents from "@/components/common/university_all_students";

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
      <UniverstiyAllStudents
        university_id={university_id}
        university_name={universityName}
      />
    </Suspense>
  );
}
