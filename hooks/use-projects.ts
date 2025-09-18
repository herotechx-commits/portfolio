'use client'

import { useState, useEffect } from 'react'
import { Project, CreateProjectData } from '@/types'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch projects')
      }

      setProjects(data.projects)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: CreateProjectData) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create project')
      }

      setProjects(prev => [data.project, ...prev])
      return data.project
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create project'
      setError(error)
      throw new Error(error)
    }
  }

  const updateProject = async (id: string, projectData: Partial<CreateProjectData>) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update project')
      }

      setProjects(prev =>
        prev.map(project => project.id === id ? data.project : project)
      )
      return data.project
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update project'
      setError(error)
      throw new Error(error)
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete project')
      }

      setProjects(prev => prev.filter(project => project.id !== id))
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete project'
      setError(error)
      throw new Error(error)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects
  }
}
