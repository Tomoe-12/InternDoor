"use client"

import { LoginForm } from "./components/login-form"
import { Briefcase } from "lucide-react"

export default function LoginPage() {
  return (
    <main className=" flex flex-col items-center justify-center bg-muted/30 p-4">
      {/* Logo - Static */}
      <div className="flex items-center gap-2 mb-8">
        <div className="rounded-lg bg-primary p-2">
          <Briefcase className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold">InternDoor</span>
      </div>

      {/* Login Form */}
      <LoginForm />

      {/* Footer */}
      <p className="mt-8 text-xs text-muted-foreground">© 2025 InternDoor. All rights reserved.</p>
    </main>
  )
}
