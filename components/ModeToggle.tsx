"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const [open, setOpen] = React.useState(false)

  return (
    <div className="relative inline-block">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="relative"
      >
        <Sun className={cn("h-[1.2rem] w-[1.2rem] transition-all", theme === "dark" ? "-rotate-90 scale-0" : "rotate-0 scale-100")} />
        <Moon className={cn("absolute h-[1.2rem] w-[1.2rem] transition-all", theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0")} />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-24 rounded-md border bg-popover text-popover-foreground shadow-lg z-50"
        >
          <button
            className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
            onClick={() => {
              setTheme("light")
              setOpen(false)
            }}
          >
            Light
          </button>
          <button
            className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
            onClick={() => {
              setTheme("dark")
              setOpen(false)
            }}
          >
            Dark
          </button>
          <button
            className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
            onClick={() => {
              setTheme("system")
              setOpen(false)
            }}
          >
            System
          </button>
        </div>
      )}
    </div>
  )
}