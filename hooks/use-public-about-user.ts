'use client'

import { useState, useEffect } from 'react'
import { AboutUser } from '@/types'

// Cache keys for public about user data
const CACHE_KEY = 'cached_public_about_user'
const CACHE_TIMESTAMP_KEY = 'cached_public_about_user_timestamp'
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes for public profile data

export function usePublicAboutUser() {
  const [aboutUser, setAboutUser] = useState<AboutUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [usingCache, setUsingCache] = useState(false)

  // Check if cached data is still valid
  const isCacheValid = () => {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
    if (!timestamp) return false
    
    const cacheAge = Date.now() - parseInt(timestamp)
    return cacheAge < CACHE_DURATION
  }

  // Get cached about user data
  const getCachedAboutUser = (): AboutUser | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.warn('Failed to parse cached about user data:', error)
      // Clear corrupted cache
      localStorage.removeItem(CACHE_KEY)
      localStorage.removeItem(CACHE_TIMESTAMP_KEY)
      return null
    }
  }

  // Save about user data to cache
  const saveToCache = (userData: AboutUser) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(userData))
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
      console.log('💾 Public about user data cached successfully')
    } catch (error) {
      console.warn('Failed to save public about user to cache:', error)
    }
  }

  // Load cached data immediately if available
  const loadCachedData = () => {
    const cachedData = getCachedAboutUser()
    if (cachedData) {
      setAboutUser(cachedData)
      setUsingCache(true)
      setLoading(false)
      console.log('📱 Loaded public about user from cache')
      return true
    }
    return false
  }

  const fetchAboutUser = async (forceRefresh = false) => {
    console.log('🔄 Fetching public about user...')
    
    try {
      // If offline, try to use cache
      if (!isOnline) {
        const hasCache = loadCachedData()
        if (hasCache) {
          setError('You are offline. Showing cached profile data.')
          return
        } else {
          setError('You are offline and no cached profile data is available.')
          setLoading(false)
          return
        }
      }

      // If online but we have valid cache and not forcing refresh, use cache first
      if (!forceRefresh && isCacheValid()) {
        const hasCache = loadCachedData()
        if (hasCache) {
          // Still fetch in background to update cache
          fetchAboutUserFromAPI(false)
          return
        }
      }

      // Fetch from API
      await fetchAboutUserFromAPI(true)

    } catch (err) {
      // If fetch fails, try to use cache as fallback
      const hasCache = loadCachedData()
      if (hasCache) {
        setError('Failed to fetch latest profile data. Showing cached data.')
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch about user'
        console.error('❌ Fetch error:', errorMessage)
        setError(errorMessage)
        setLoading(false)
      }
    }
  }

  const fetchAboutUserFromAPI = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      setError(null)
      
      const response = await fetch('/api/public/about', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
      })
      
      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))

      if (response.status === 404) {
        console.log('ℹ️ No public about user data found (404)')
        setAboutUser(null)
        setUsingCache(false)
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
      setUsingCache(false)
      
      // Cache the fresh data
      if (data.aboutUser) {
        saveToCache(data.aboutUser)
      }
      
      console.log('✅ Public about user data loaded successfully')

    } catch (err) {
      throw err
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Back online - refreshing public about user data')
      setIsOnline(true)
      setError(null)
      // When coming back online, fetch fresh data
      fetchAboutUser(true)
    }

    const handleOffline = () => {
      console.log('📱 Gone offline - using cached public about user data')
      setIsOnline(false)
      // When going offline, ensure we have cached data loaded
      if (!aboutUser) {
        loadCachedData()
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [aboutUser])

  // Initial load
  useEffect(() => {
    fetchAboutUser()
  }, [])

  // Clear error after 5 seconds if we have data
  useEffect(() => {
    if (error && aboutUser) {
      const timer = setTimeout(() => {
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, aboutUser])

  return {
    aboutUser,
    loading,
    error,
    isOnline,
    usingCache,
    refetch: () => fetchAboutUser(true)
  }
}