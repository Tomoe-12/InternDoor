"use client"

import StudentDetails from "@/components/common/studentDetails"
import { use, useState } from "react"

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingAcademic, setIsEditingAcademic] = useState(false)

  const resolvedParams = use(params)
  const student = students.find((u) => u.id === resolvedParams.id) || students[0]

  return (
    <StudentDetails student={student!} id={resolvedParams.id} />
  )
}

const students = [
  {
    id: "1",
    name: "Sarah",
    surname: "Johnson",
    email: "sarah.johnson@student.edu",
    university: "MIT",
    phone: "+1 617 234 5678",
    status: "Active",
    profilePicture: "/professional-woman-diverse.png",
    overallGPA: 3.85,
    yearOfStudy: "Junior",
    universityStartYear: "2023",
    graduationYear: "2026",
    major: "Computer Science",
    minor: "Business Administration",
    skills: ["JavaScript", "Python", "React", "Node.js", "Machine Learning"],
    interests: "Software development and AI applications in healthcare technology",
    twoFactorEnabled: false,
    academicRecords: [
      {
        year: "First Year",
        yearGPA: 3.72,
        semesters: [
          {
            name: "Fall 2023",
            startDate: "Sep 2023",
            endDate: "Dec 2023",
            gpa: 3.65,
            subjects: [
              { name: "Introduction to Computer Science", code: "CS101", grade: "A-", credits: 4 },
              { name: "Calculus I", code: "MATH101", grade: "B+", credits: 4 },
              { name: "Physics I", code: "PHYS101", grade: "B+", credits: 4 },
              { name: "English Composition", code: "ENG101", grade: "A", credits: 3 },
            ],
          },
          {
            name: "Spring 2024",
            startDate: "Jan 2024",
            endDate: "May 2024",
            gpa: 3.79,
            subjects: [
              { name: "Data Structures", code: "CS102", grade: "A", credits: 4 },
              { name: "Calculus II", code: "MATH102", grade: "A-", credits: 4 },
              { name: "Physics II", code: "PHYS102", grade: "B+", credits: 4 },
              { name: "Introduction to Business", code: "BUS101", grade: "A", credits: 3 },
            ],
          },
        ],
      },
      {
        year: "Second Year",
        yearGPA: 3.88,
        semesters: [
          {
            name: "Fall 2024",
            startDate: "Sep 2024",
            endDate: "Dec 2024",
            gpa: 3.85,
            subjects: [
              { name: "Algorithms", code: "CS201", grade: "A", credits: 4 },
              { name: "Linear Algebra", code: "MATH201", grade: "A-", credits: 4 },
              { name: "Database Systems", code: "CS202", grade: "A", credits: 4 },
              { name: "Microeconomics", code: "ECON201", grade: "B+", credits: 3 },
            ],
          },
          {
            name: "Spring 2025",
            startDate: "Jan 2025",
            endDate: "May 2025",
            gpa: 3.91,
            subjects: [
              { name: "Operating Systems", code: "CS203", grade: "A", credits: 4 },
              { name: "Probability & Statistics", code: "MATH202", grade: "A", credits: 4 },
              { name: "Web Development", code: "CS204", grade: "A", credits: 4 },
              { name: "Marketing Fundamentals", code: "BUS201", grade: "A-", credits: 3 },
            ],
          },
        ],
      },
      {
        year: "Third Year",
        yearGPA: 3.95,
        semesters: [
          {
            name: "Fall 2025",
            startDate: "Sep 2025",
            endDate: "Dec 2025",
            gpa: 3.92,
            subjects: [
              { name: "Machine Learning", code: "CS301", grade: "A", credits: 4 },
              { name: "Computer Networks", code: "CS302", grade: "A", credits: 4 },
              { name: "Software Engineering", code: "CS303", grade: "A-", credits: 4 },
              { name: "Business Strategy", code: "BUS301", grade: "A", credits: 3 },
            ],
          },
          {
            name: "Spring 2026",
            startDate: "Jan 2026",
            endDate: "May 2026",
            gpa: 3.98,
            subjects: [
              { name: "Artificial Intelligence", code: "CS304", grade: "A", credits: 4 },
              { name: "Distributed Systems", code: "CS305", grade: "A", credits: 4 },
              { name: "Capstone Project", code: "CS399", grade: "A", credits: 4 },
              { name: "Entrepreneurship", code: "BUS302", grade: "A", credits: 3 },
            ],
          },
        ],
      },
    ],
  },
]
