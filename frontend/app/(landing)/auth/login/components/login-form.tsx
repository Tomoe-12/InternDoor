
// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Building2, GraduationCap, Eye, EyeOff } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { FcGoogle } from "react-icons/fc";

// type UserRole = "company" | "student"

// interface RoleOption {
//   id: UserRole
//   label: string
//   icon: React.ReactNode
//   description: string
// }

// const roles: RoleOption[] = [
//   {
//     id: "student",
//     label: "Student",
//     icon: <GraduationCap className="h-5 w-5" />,
//     description: "Find internship opportunities",
//   },
//   {
//     id: "company",
//     label: "Company",
//     icon: <Building2 className="h-5 w-5" />,
//     description: "Post internships & find talent",
//   },
// ]

// export function LoginForm() {
//   const [selectedRole, setSelectedRole] = useState<UserRole>("student")
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [isOAuthLoading, setIsOAuthLoading] = useState<"google" | "github" | null>(null)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     // TODO: Implement actual authentication logic
//     console.log("Login attempt:", { email, password, role: selectedRole })

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1500))
//     setIsLoading(false)
//   }

//   const handleOAuthLogin = async (provider: "google" | "github") => {
//     setIsOAuthLoading(provider)

//     // TODO: Implement actual OAuth logic
//     console.log("OAuth login attempt:", { provider, role: selectedRole })

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1500))
//     setIsOAuthLoading(null)
//   }

//   return (
//     <Card className="w-full max-w-md shadow-lg">
//       <CardHeader className="text-center space-y-1">
//         <CardTitle className="text-2xl font-bold text-balance">Welcome Back</CardTitle>
//         <CardDescription className="text-pretty">Sign in to your InternDoor account</CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {/* Role Selection */}
//         <div className="space-y-3">
//           <Label className="text-sm font-medium">I am a</Label>
//           <div className="grid grid-cols-2 gap-2">
//             {roles.map((role) => (
//               <button
//                 key={role.id}
//                 type="button"
//                 onClick={() => setSelectedRole(role.id)}
//                 className={cn(
//                   "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all hover:border-primary/50",
//                   selectedRole === role.id ? "border-primary bg-primary/5" : "border-border bg-background",
//                 )}
//               >
//                 <div
//                   className={cn(
//                     "rounded-full p-2 transition-colors",
//                     selectedRole === role.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
//                   )}
//                 >
//                   {role.icon}
//                 </div>
//                 <span
//                   className={cn(
//                     "text-xs font-medium",
//                     selectedRole === role.id ? "text-primary" : "text-muted-foreground",
//                   )}
//                 >
//                   {role.label}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               disabled={isLoading || isOAuthLoading !== null}
//             />
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center justify-between">
//               <Label htmlFor="password">Password</Label>
//               <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
//                 Forgot password?
//               </a>
//             </div>
//             <div className="relative">
//               <Input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 disabled={isLoading || isOAuthLoading !== null}
//                 className="pr-10"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
//               </button>
//             </div>
//           </div>

//           <Button type="submit" className="w-full" disabled={isLoading || isOAuthLoading !== null}>
//             {isLoading ? "Signing in..." : "Sign In"}
//           </Button>
//         </form>

//         <div className="space-y-3">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <span className="w-full border-t" />
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <Button
//               variant="outline"
//               type="button"
//               disabled={isOAuthLoading !== null || isLoading}
//               onClick={() => handleOAuthLogin("google")}
//               className="gap-2"
//             >
//               {isOAuthLoading === "google" ? (
//                 <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//               ) : (
//                 <FcGoogle className="h-4 w-4" />
//               )}
//               Google
//             </Button>
//             <Button
//               variant="outline"
//               type="button"
//               disabled={isOAuthLoading !== null || isLoading}
//               onClick={() => handleOAuthLogin("github")}
//               className="gap-2"
//             >
//               {isOAuthLoading === "github" ? (
//                 <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//               ) : (
//                 <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
//                 </svg>
//               )}
//               GitHub
//             </Button>
//           </div>
//         </div>

//         {/* Sign Up Link */}
//         <div className="text-center text-sm text-muted-foreground">
//           Don&apos;t have an account?{" "}
//           <a href="#" className="font-medium text-primary hover:underline">
//             Sign up
//           </a>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // Default export required by Next.js app router pages
// export default function LoginPage() {
//   return (
//     <div className="flex items-center justify-center h-full p-4">
//       <LoginForm />
//     </div>
//   )
// }

"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, GraduationCap, Eye, EyeOff, DoorOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { FcGoogle } from "react-icons/fc";

type UserRole = "company" | "student"

interface RoleOption {
  id: UserRole
  label: string
  icon: React.ReactNode
  description: string
}

const roles: RoleOption[] = [
  {
    id: "student",
    label: "Student",
    icon: <GraduationCap className="h-5 w-5" />,
    description: "Find internship opportunities",
  },
  {
    id: "company",
    label: "Company",
    icon: <Building2 className="h-5 w-5" />,
    description: "Post internships & find talent",
  },
]

export function LoginForm() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState<"google" | "github" | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Implement actual authentication logic
    console.log("Login attempt:", { email, password, role: selectedRole })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setIsOAuthLoading(provider)

    // TODO: Implement actual OAuth logic
    console.log("OAuth login attempt:", { provider, role: selectedRole })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsOAuthLoading(null)
  }

  const heroContent = {
    student: {
      // public/ is served at the site root; use absolute path from public
      image: "/images/student-studying-laptop-library.jpg",
      title: "Launch your career with the perfect internship",
      description:
        "Connect with top companies offering internships that match your skills and career goals. Your next opportunity is just a click away.",
    },
    company: {
      image: "/images/modern-office-team-collaboration.jpg",
      title: "Find exceptional talent for your team",
      description:
        "Access a pool of motivated students ready to bring fresh perspectives and energy to your organization. Build your future workforce today.",
    },
  }

  const currentHero = heroContent[selectedRole]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${currentHero.image})` }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
              <DoorOpen className="h-8 w-8" />
              InternDoor
            </Link>
          </div>
          <div className="space-y-4 max-w-md">
            <h1 className="text-4xl font-bold leading-tight text-balance">{currentHero.title}</h1>
            <p className="text-lg text-primary-foreground/80 text-pretty leading-relaxed">{currentHero.description}</p>
          </div>
          <div className="text-sm text-primary-foreground/60">© 2025 InternDoor. All rights reserved.</div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary">
              <DoorOpen className="h-7 w-7" />
              InternDoor
            </Link>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-balance">Welcome back</h2>
            <p className="text-muted-foreground text-pretty">Sign in to your account to continue</p>
          </div>

          <div className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">I am signing in as a</Label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:border-primary/50",
                      selectedRole === role.id ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card",
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-full p-2.5 transition-colors",
                        selectedRole === role.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {role.icon}
                    </div>
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        selectedRole === role.id ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {role.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading || isOAuthLoading !== null}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading || isOAuthLoading !== null}
                    className="pr-10 h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading || isOAuthLoading !== null}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground font-medium">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  type="button"
                  disabled={isOAuthLoading !== null || isLoading}
                  onClick={() => handleOAuthLogin("google")}
                  className="gap-2 h-11"
                >
                  {isOAuthLoading === "google" ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <FcGoogle className="h-4 w-4" />
                  )}
                  Google
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isOAuthLoading !== null || isLoading}
                  onClick={() => handleOAuthLogin("github")}
                  className="gap-2 h-11"
                >
                  {isOAuthLoading === "github" ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  )}
                  GitHub
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
