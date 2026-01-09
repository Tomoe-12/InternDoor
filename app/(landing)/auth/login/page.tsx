"use client"

import { LoginForm } from "./components/login-form"
import { Briefcase } from "lucide-react"
import { Suspense } from "react"

export default function LoginPage() {
  return (
    <main >
      {/* Logo - Static
      <div className="flex items-center gap-2 mb-8">
        <div className="rounded-lg bg-primary p-2">
          <Briefcase className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold">InternDoor</span>
      </div> */}

      {/* Login Form */}
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>

      {/* Footer
      <p className="mt-8 text-xs text-muted-foreground">© 2025 InternDoor. All rights reserved.</p> */}
    </main>
  )
}
