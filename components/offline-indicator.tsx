'use client'

import React from 'react'
import { useOnline } from '@/hooks/use-online'

export default function OfflineIndicator() {
  const isOnline = useOnline()

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white px-4 py-2 text-center text-sm font-medium z-50">
      📴 You&apos;re offline. Some features may not work properly.
    </div>
  )
}