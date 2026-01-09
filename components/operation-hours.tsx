"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DayHours {
  isOpen: boolean
  openTime: string
  closeTime: string
}

interface OperationHoursProps {
  value?: Record<string, DayHours>
  onChange?: (hours: Record<string, DayHours>) => void
  disabled?: boolean
  className?: string
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const

const defaultHours: DayHours = {
  isOpen: false,
  openTime: "09:00",
  closeTime: "17:00",
}

export function OperationHours({ value, onChange, disabled = false, className }: OperationHoursProps) {
  const [hours, setHours] = React.useState<Record<string, DayHours>>(() => {
    if (value) return value
    return DAYS.reduce(
      (acc, day) => ({
        ...acc,
        [day]: { ...defaultHours },
      }),
      {} as Record<string, DayHours>,
    )
  })

  const handleToggle = (day: string) => {
    const newHours = {
      ...hours,
      [day]: {
        ...hours[day],
        isOpen: !hours[day].isOpen,
      },
    }
    setHours(newHours)
    onChange?.(newHours)
  }

  const handleTimeChange = (day: string, type: "openTime" | "closeTime", value: string) => {
    const newHours = {
      ...hours,
      [day]: {
        ...hours[day],
        [type]: value,
      },
    }
    setHours(newHours)
    onChange?.(newHours)
  }

  return (
    <div className={cn("space-y-3", className)}>
      {DAYS.map((day) => (
        <div key={day} className="flex flex-col gap-3 rounded-lg border border-input p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 sm:w-40">
            <Switch
              checked={hours[day].isOpen}
              onCheckedChange={() => handleToggle(day)}
              disabled={disabled}
              aria-label={`Toggle ${day}`}
            />
            <Label className="text-sm font-medium">{day}</Label>
          </div>

          {hours[day].isOpen && (
            <div className="flex flex-1 items-center gap-2">
              <Input
                type="time"
                value={hours[day].openTime}
                onChange={(e) => handleTimeChange(day, "openTime", e.target.value)}
                disabled={disabled}
                className="flex-1"
                aria-label={`${day} opening time`}
              />
              <span className="text-sm text-muted-foreground">to</span>
              <Input
                type="time"
                value={hours[day].closeTime}
                onChange={(e) => handleTimeChange(day, "closeTime", e.target.value)}
                disabled={disabled}
                className="flex-1"
                aria-label={`${day} closing time`}
              />
            </div>
          )}

          {!hours[day].isOpen && <div className="flex-1 text-sm text-muted-foreground sm:text-right">Closed</div>}
        </div>
      ))}
    </div>
  )
}
