"use client"

import { useEffect } from "react"

export default function ServiceWorkerGuard() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator)) return

    // Only run in non-production to avoid interfering with real PWA behavior
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => Promise.all(regs.map((r) => r.unregister())))
        .then(() => {
          // clear caches to avoid serving stale assets during dev
          if ("caches" in window) {
            caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
          }
          console.log("Service workers and caches cleared (dev)")
        })
        .catch((err) => console.error("Error unregistering service workers:", err))
    }
  }, [])

  return null
}
