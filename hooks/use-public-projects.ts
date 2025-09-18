'use client'

import { useState, useEffect } from 'react'
import { Project } from '@/types'

// Cache key for storing projects data
const CACHE_KEY = 'cached_public_projects'
const CACHE_TIMESTAMP_KEY = 'cached_projects_timestamp'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export function usePublicProjects() {
  const [projects, setProjects] = useState<Project[]>([])
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

  // Get cached projects
  const getCachedProjects = (): Project[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  }

  // Save projects to cache
  const saveToCache = (projectsData: Project[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(projectsData))
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
    } catch (error) {
      console.warn('Failed to save to cache:', error)
    }
  }

  // Load cached data immediately if available
  const loadCachedData = () => {
    const cachedProjects = getCachedProjects()
    if (cachedProjects && cachedProjects.length > 0) {
      setProjects(cachedProjects)
      setUsingCache(true)
      setLoading(false)
      return true
    }
    return false
  }

  const fetchProjects = async (forceRefresh = false) => {
    try {
      // If offline, try to use cache
      if (!isOnline) {
        const hasCache = loadCachedData()
        if (hasCache) {
          setError('You are offline. Showing cached data.')
          return
        } else {
          setError('You are offline and no cached data is available.')
          setLoading(false)
          return
        }
      }

      // If online but we have valid cache and not forcing refresh, use cache first
      if (!forceRefresh && isCacheValid()) {
        const hasCache = loadCachedData()
        if (hasCache) {
          // Still fetch in background to update cache
          fetchProjectsFromAPI(false)
          return
        }
      }

      // Fetch from API
      await fetchProjectsFromAPI(true)

    } catch (err) {
      // If fetch fails, try to use cache as fallback
      const hasCache = loadCachedData()
      if (hasCache) {
        setError('Failed to fetch latest data. Showing cached data.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects')
        setLoading(false)
      }
    }
  }

  const fetchProjectsFromAPI = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      setError(null)
      
      const response = await fetch('/api/projects', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        }
      })
      
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch projects')
      }

      setProjects(data.projects)
      setUsingCache(false)
      saveToCache(data.projects) // Cache the fresh data
      
    } catch (err) {
      throw err
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // When coming back online, fetch fresh data
      fetchProjects(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
      // When going offline, ensure we have cached data loaded
      if (projects.length === 0) {
        loadCachedData()
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [projects.length])

  // Initial load
  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    isOnline,
    usingCache,
    refetch: () => fetchProjects(true)
  }
}