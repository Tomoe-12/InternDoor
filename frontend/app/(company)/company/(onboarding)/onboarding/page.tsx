"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Building2, Briefcase, Store, Linkedin, ArrowRight, ArrowLeft, Check } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { FileUpload } from "@/components/FileUpload"
import { OperationHours } from "@/components/operation-hours"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import httpClient from "@/lib/httpClient"
import { useRouter } from "next/navigation"
import { useUploadThing } from "@/lib/uploadthing"
import { useAuthGuard } from "@/lib/auth/use-auth"

// Form schema
const formSchema = z.object({
  industry: z.string().min(1, "Please select an industry"),
  organizationSize: z.string().min(1, "Please select organization size"),
  organizationType: z.string().min(1, "Please select organization type"),
  // Avoid runtime crashes if File is undefined during SSR or bundling
  logo: z
    .custom<File>((val) => typeof window !== "undefined" && val instanceof File, {
      message: "Please upload a company logo",
    }),
  address: z.string().min(10, "Please enter a complete address"),
  shopDescription: z.enum(["online", "physical", "both"], {
    required_error: "Please select your business model",
  }),
  operationHours: z
    .record(
      z.object({
        isOpen: z.boolean(),
        openTime: z.string(),
        closeTime: z.string(),
      }),
    )
    .optional(),
  linkedinUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
})

type FormValues = z.infer<typeof formSchema>

type StepId = 1 | 2 | 3
const STEPS: ReadonlyArray<{ id: StepId; title: string; description: string; icon: LucideIcon }> = [
  {
    id: 1,
    title: "Company Information",
    description: "Basic details about your organization",
    icon: Building2,
  },
  {
    id: 2,
    title: "Business Details",
    description: "Location and operation information",
    icon: Store,
  },
  {
    id: 3,
    title: "Additional Information",
    description: "Logo and social profiles",
    icon: Linkedin,
  },
] as const

export default function CompanyDetailsForm() {
  const [currentStep, setCurrentStep] = React.useState<StepId>(1)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitIntent, setSubmitIntent] = React.useState(false)
  const router = useRouter()
  const { startUpload, isUploading } = useUploadThing("companyLogo")
  const { user, mutate } = useAuthGuard({ middleware: "auth" })

  // If profile is already complete, keep user on dashboard
  React.useEffect(() => {
    if (user && (user as any)?.profileComplete) {
      router.replace("/company/dashboard")
    }
  }, [user, router])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      industry: "",
      organizationSize: "",
      organizationType: "",
      logo: undefined as unknown as File, // will be set by FileUpload
      address: "",
      shopDescription: undefined,
      operationHours: undefined,
      linkedinUrl: "",
    },
  })

  const progress = (currentStep / STEPS.length) * 100
  // Safely resolve current step to avoid undefined indexing (and assert non-null)
  const stepIndex = Math.min(Math.max(currentStep - 1, 0), STEPS.length - 1)
  const step = STEPS[stepIndex]!

  const shopDescription = form.watch("shopDescription")

  // Keep address in sync when selecting Online Only
  React.useEffect(() => {
    if (shopDescription === "online") {
      form.setValue("address", "Online Only", { shouldValidate: true, shouldDirty: true })
    } else if (form.getValues("address") === "Online Only") {
      form.setValue("address", "", { shouldValidate: false, shouldDirty: true })
    }
  }, [shopDescription, form])

  const onSubmit = async (data: FormValues) => {
    // Double-guard: only submit on the final step and only when user explicitly clicked submit
    if (currentStep < STEPS.length || !submitIntent) {
      return
    }

    setIsSubmitting(true)

    try {
      let logoUrl = ""
      if (data.logo) {
        const uploadRes = await startUpload([data.logo])
        logoUrl = uploadRes?.[0]?.url ?? ""
        if (!logoUrl) {
          throw new Error("Logo upload failed. Please try again.")
        }
      }

      // Upload logo if provided (placeholder: assume backend accepts string path) — extend to real upload if needed
      const payload = {
        industry: data.industry,
        organization_size: data.organizationSize,
        organization_type: data.organizationType,
        logo: logoUrl,
        address: data.address,
        description: data.shopDescription,
        operating_hours: JSON.stringify(data.operationHours ?? {}),
        linkedin_profile: data.linkedinUrl ?? "",
      }

      await httpClient.patch("/api/companies/profile", payload)

      // Refresh auth user so profileComplete flag updates and layout stops redirecting
      await mutate?.()

      toast.success("Company details saved successfully!")
      router.push("/company/dashboard")
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to save company details"
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
      setSubmitIntent(false)
    }
  }

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = []

    if (currentStep === 1) {
      fieldsToValidate = ["industry", "organizationSize", "organizationType"]
    } else if (currentStep === 2) {
      fieldsToValidate = ["address", "shopDescription"]
      // No extra fields required for Online Only beyond address and business model
    }

    // Only trigger validation for the current step's fields
    let isValid = false
    try {
      isValid = await form.trigger(fieldsToValidate)
    } catch (e) {
      isValid = false
    }

    console.log("[v0] Step validation:", { currentStep, fieldsToValidate, isValid, errors: form.formState.errors })

    if (isValid && currentStep < STEPS.length) {
      setCurrentStep((currentStep + 1) as StepId)
    } else {
      // Show error messages for invalid fields
      console.log("[v0] Validation failed:", form.formState.errors)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as StepId)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-balance">Complete Your Company Profile</h1>
          <p className="mt-2 text-muted-foreground text-pretty">
            {"Help us understand your business better by providing additional details"}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Indicator */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {STEPS.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div
                key={step.id}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all",
                  isActive && "border-primary bg-primary/5 shadow-sm dark:bg-primary/10",
                  isCompleted && "border-primary/50",
                  !isActive && !isCompleted && "opacity-50",
                )}
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full transition-colors",
                    isActive && "bg-primary text-primary-foreground",
                    isCompleted && "bg-primary text-primary-foreground",
                    !isActive && !isCompleted && "bg-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="size-5" /> : <Icon className="size-5" />}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-medium">{step.title}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(step.icon, {
                className: "size-5",
              })}
              {step.title}
            </CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onKeyDown={(e) => {
                  // Prevent implicit submits via Enter on any step; force explicit button click
                  if (e.key === "Enter") {
                    e.preventDefault()
                    if (currentStep < STEPS.length) {
                      void nextStep()
                    }
                  }
                }}
                onSubmit={(e) => {
                  if (currentStep < STEPS.length) {
                    e.preventDefault()
                    void nextStep()
                    return
                  }
                  form.handleSubmit(onSubmit)(e)
                }}
                className="space-y-6"
              >
                {/* Step 1: Company Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="hospitality">Hospitality</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>{"Select the industry that best describes your business"}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="organizationSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select organization size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-50">11-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-500">201-500 employees</SelectItem>
                              <SelectItem value="501-1000">501-1000 employees</SelectItem>
                              <SelectItem value="1000+">1000+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>{"How many employees work at your organization?"}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="organizationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select organization type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="startup">Startup</SelectItem>
                              <SelectItem value="small-business">Small Business</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                              <SelectItem value="nonprofit">Non-Profit</SelectItem>
                              <SelectItem value="government">Government</SelectItem>
                              <SelectItem value="freelance">Freelance/Solo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>{"What type of organization are you?"}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Business Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your complete business address"
                              className="min-h-24 resize-none"
                              disabled={shopDescription === "online"}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>{"Include street, city, state, and postal code"}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shopDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Model</FormLabel>
                          <FormControl>
                              <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value ?? undefined}
                              className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                            >
                              <div>
                                <RadioGroupItem value="online" id="online" className="peer sr-only" />
                                <Label
                                  htmlFor="online"
                                  className="flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 dark:peer-data-[state=checked]:bg-primary/10"
                                >
                                  <Store className="mb-2 size-6" />
                                  <span className="text-sm font-medium">Online Only</span>
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem value="physical" id="physical" className="peer sr-only" />
                                <Label
                                  htmlFor="physical"
                                  className="flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 dark:peer-data-[state=checked]:bg-primary/10"
                                >
                                  <Building2 className="mb-2 size-6" />
                                  <span className="text-sm font-medium">Physical Store</span>
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem value="both" id="both" className="peer sr-only" />
                                <Label
                                  htmlFor="both"
                                  className="flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 dark:peer-data-[state=checked]:bg-primary/10"
                                >
                                  <Briefcase className="mb-2 size-6" />
                                  <span className="text-sm font-medium">Both</span>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormDescription>{"Select how customers can access your business"}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Service Area removed per request */}

                    <FormField
                      control={form.control}
                      name="operationHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operation Hours</FormLabel>
                          <FormControl>
                            <OperationHours value={field.value} onChange={field.onChange} />
                          </FormControl>
                          <FormDescription>{"Set your business hours for each day of the week"}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Additional Information */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Logo</FormLabel>
                          <FormControl>
                            <FileUpload
                              value={field.value || null}
                              onChange={field.onChange}
                              accept="image/*"
                              maxSize={5 * 1024 * 1024}
                            />
                          </FormControl>
                          <FormDescription>{"Upload your company logo (PNG, JPG, or GIF up to 5MB)"}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="linkedinUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn Profile URL</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="https://linkedin.com/company/your-company" {...field} />
                          </FormControl>
                          <FormDescription>{"Add your company LinkedIn profile (optional)"}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <div className="rounded-lg bg-muted p-4">
                      <h3 className="mb-2 text-sm font-medium">{"Review Your Information"}</h3>
                      <p className="text-sm text-muted-foreground text-pretty">
                        {
                          "Please review all the information before submitting. You can go back to any step to make changes."
                        }
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1 || isSubmitting}
                    className="w-full sm:w-auto bg-transparent"
                  >
                    <ArrowLeft className="mr-2 size-4" />
                    Previous
                  </Button>

                  {currentStep < STEPS.length ? (
                    <Button type="button" onClick={nextStep} className="w-full sm:w-auto">
                      Next
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting || isUploading}
                      className="w-full sm:w-auto"
                      onClick={() => setSubmitIntent(true)}
                    >
                      {isSubmitting || isUploading ? (
                        <>
                          <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          {isUploading ? "Uploading..." : "Submitting..."}
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 size-4" />
                          Complete Registration
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {"Need help? Contact us at"}{" "}
          <a href="mailto:support@company.com" className="font-medium text-primary hover:underline">
            support@company.com
          </a>
        </p>
      </div>
    </div>
  )
}
