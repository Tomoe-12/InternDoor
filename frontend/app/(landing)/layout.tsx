"use client"

import Logo from '@/components/Logo';
import Navbar from '@/components/Navbar';
import { useSubscribeToPushNotifications } from '@/lib/hooks/useSubscribeToPushNotifications';
import React, { useEffect } from 'react'

export default function layout({children}: {children: React.ReactNode}) {
  const { subscribe, subscription } = useSubscribeToPushNotifications();

  useEffect(() => {
    if (!subscription) subscribe()
  }, [subscription])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="w-full">
        <div className="w-full max-w-screen-xl mx-auto px-4 py-3">
          <Navbar className='w-full'/>
        </div>
      </header>

      <main className="pt-20 px-4 max-w-screen-xl mx-auto">
        {children}
      </main>
    </div>
  )
}
