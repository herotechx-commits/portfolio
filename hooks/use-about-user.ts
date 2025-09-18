'use client'

import { useState, useEffect } from 'react'
import { AboutUser, CreateAboutUserData } from '@/types'

export function useAboutUser() {
  const [aboutUser, setAboutUser] = useState<AboutUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAboutUser = async () => {
    console.log('🔄 Fetching about user...')
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/about', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })
      
      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))

      if (response.status === 404) {
        console.log('ℹ️ No about user data found (404)')
        setAboutUser(null)
        return
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('❌ Non-JSON response:', text.substring(0, 200))
        throw new Error('Server returned non-JSON response')
      }

      const data = await response.json()
      console.log('📦 Response data:', data)

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`)
      }

      setAboutUser(data.aboutUser)
      console.log('✅ About user data loaded successfully')
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch about user'
      console.error('❌ Fetch error:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const saveAboutUser = async (aboutUserData: CreateAboutUserData) => {
    console.log('💾 Saving about user...', aboutUserData)
    
    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(aboutUserData),
      })

      console.log('📡 Save response status:', response.status)

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('❌ Non-JSON response:', text.substring(0, 200))
        throw new Error('Server returned non-JSON response')
      }

      const data = await response.json()
      console.log('📦 Save response data:', data)

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`)
      }

      setAboutUser(data.aboutUser)
      console.log(data.aboutUser);
      
      console.log('✅ About user saved successfully')
      return data.aboutUser
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save about user'
      console.error('❌ Save error:', errorMessage)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    fetchAboutUser()
  }, [])

  return {
    aboutUser,
    loading,
    error,
    saveAboutUser,
    refetch: fetchAboutUser
  }
}
