'use client'

import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import AboutUserManager from './about-user-manager'
import ProjectManager from './project-manager'
import { Menu, X } from 'lucide-react'

export default function AdminDashboard() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<'projects' | 'about'>('projects')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleTabClick = (tabId: 'projects' | 'about') => {
    setActiveTab(tabId)
    setIsMobileMenuOpen(false) // Close mobile menu when tab is selected
  }

  const tabs = [
    { id: 'projects' as const, label: 'Projects', component: ProjectManager },
    { id: 'about' as const, label: 'About User', component: AboutUserManager },
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ProjectManager

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-gray-800 lg:mx-[15%] mx-5 z-10 mt-5 rounded-3xl shadow-sm border-b border-gray-700">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo and Desktop Navigation */}
            <div className="flex items-center space-x-8">
              <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
              
              {/* Desktop Tab Navigation */}
              <div className="hidden lg:flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`px-4  text-sm font-medium rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right side - User info and Sign out (Desktop) */}
            <div className="hidden lg:flex  gap-3 items-center space-x-4">
              <span className="text-gray-300 text-xs flex">Welcome, {user?.name}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              >
                Sign Out
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-300 hover:text-white p-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-110"
                aria-label="Toggle mobile menu"
              >
                <div className="relative w-6 h-6">
                  <Menu 
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ease-in-out transform ${
                      isMobileMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
                    }`} 
                  />
                  <X 
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ease-in-out transform ${
                      isMobileMenuOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'
                    }`} 
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
              isMobileMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pt-4 pb-2 space-y-1 border-t border-gray-700 mt-4">
              {/* Mobile Tab Navigation */}
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:translate-x-2 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${index * 100}ms` : '0ms'
                  }}
                >
                  {tab.label}
                </button>
              ))}
              
              {/* Mobile User Info and Sign Out */}
              <div className="pt-4 border-t border-gray-700 mt-4 space-y-2">
                <div className="px-4 py-2 text-gray-300 text-sm">
                  Welcome, {user?.name}
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out transform hover:translate-x-2 hover:shadow-lg"
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${tabs.length * 100 + 100}ms` : '0ms'
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        <ActiveComponent />
      </main>
    </div>
  )
}