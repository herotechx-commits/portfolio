'use client';

import { useState, useEffect } from 'react'

export function useOnline() {
  const [isOnline, setIsOnline] = useState<boolean>(true)

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      console.log('🌐 App is back online')
      setIsOnline(true)
    }

    const handleOffline = () => {
      console.log('📴 App is offline')
      setIsOnline(false)
    }

    // Add event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}