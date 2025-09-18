'use client'

import React, { useState } from 'react'
import { useProjects } from '@/hooks/use-projects'
import { CreateProjectData, Project } from '@/types'
import Image from 'next/image'

export default function ProjectManager() {
  const { projects, loading, error, createProject, updateProject, deleteProject } = useProjects()
  const [isCreating, setIsCreating] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState<CreateProjectData>({
    projectName: '',
    projectImage: '',
    projectLink: '',
    projectGithub: '',
    projectDescription: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData)
        setEditingProject(null)
      } else {
        await createProject(formData)
        setIsCreating(false)
      }
      
      setFormData({
        projectName: '',
        projectImage: '',
        projectLink: '',
        projectGithub: '',
        projectDescription: '',
      })
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      projectName: project.projectName || '',
      projectImage: project.projectImage || '',
      projectLink: project.projectLink || '',
      projectGithub: project.projectGithub || '',
      projectDescription: project.projectDescription || '',
    })
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id)
      } catch (error) {
        console.error('Error deleting project:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      projectName: '',
      projectImage: '',
      projectLink: '',
      projectGithub: '',
      projectDescription: '',
    })
    setIsCreating(false)
    setEditingProject(null)
  }

  if (loading) return <div className="text-center">Loading projects...</div>
  if (error) return <div className="text-red-600">Error: {error}</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Project Manager</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add New Project
        </button>
      </div>

      {/* Form */}
      {(isCreating || editingProject) && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProject ? 'Edit Project' : 'Create New Project'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Name *</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Project Image URL</label>
              <input
                type="url"
                name="projectImage"
                value={formData.projectImage}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Project Link</label>
              <input
                type="url"
                name="projectLink"
                value={formData.projectLink}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
              <input
                type="url"
                name="projectGithub"
                value={formData.projectGithub}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                {editingProject ? 'Update Project' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="bg-amber-950 flex flex-wrap rounded-lg shadow-md overflow-hidden">
            {project.projectImage && (
              <Image
                src={project.projectImage}
                alt={project.projectName || 'Project'}
                width={100}
                height={100}
                className="w-full h-48 object-cover"
              />
            )}
            
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{project.projectName}</h3>
              <p className="text-gray-600 text-sm mb-3">{project.projectDescription}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.projectLink && (
                  <a
                    href={project.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Live Demo
                  </a>
                )}
                {project.projectGithub && (
                  <a
                    href={project.projectGithub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-50 hover:text-gray-200 text-sm"
                  >
                    GitHub
                  </a>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No projects found. Create your first project!
        </div>
      )}
    </div>
  )
}
