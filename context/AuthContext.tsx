'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface User {
  id: string
  email: string
  name: string
  createdAt?: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const signUp = async (email: string, password: string, name: string) => {
    console.log('🚀 Starting signup process...')
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password, name }),
      })

      console.log('📡 Signup response status:', response.status)
      console.log('📡 Signup response headers:', response.headers)

      let data
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
        console.log('📦 Signup response data:', data)
      } else {
        const text = await response.text()
        console.log('📄 Non-JSON response:', text.substring(0, 200))
        throw new Error('Server returned non-JSON response. Check your API route.')
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      setUser(data.user)
      console.log('✅ Signup successful')

    } catch (error) {
      console.error('❌ Signup error:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log('🚀 Starting signin process...')
    
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      })

      console.log('📡 Signin response status:', response.status)

      let data
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
        console.log('📦 Signin response data:', data)
      } else {
        const text = await response.text()
        console.log('📄 Non-JSON response:', text.substring(0, 200))
        throw new Error('Server returned non-JSON response. Check your API route.')
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      setUser(data.user)
      console.log('✅ Signin successful')

    } catch (error) {
      console.error('❌ Signin error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      setUser(null)
      console.log('✅ Signout successful')
    } catch (error) {
      console.error('❌ Signout error:', error)
      setUser(null) // Sign out anyway
    }
  }

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          console.log('✅ User session restored')
        }
      } catch (error) {
        console.log('ℹ️ No existing session found')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
