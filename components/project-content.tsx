import React from 'react'
import { ProjectCard } from './project-card'
import { usePublicProjects } from '@/hooks/use-public-projects'
import { Loading } from './loading'

export function ProjectContent() {
  const { projects, loading, error, isOnline, usingCache, refetch } = usePublicProjects()
    
  if (loading) return <Loading />

  // Helper function to extract author name
  const getAuthorName = (author: string | { id: string; name: string; email: string; } | undefined): string => {
    if (!author) return '';
    if (typeof author === 'string') return author;
    return author.name || '';
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white mb-4">Featured Projects</h3>
        
        {/* Online/Offline Status */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-white/60">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
      {/* Error/Cache Status Banner */}
      {(error || usingCache) && (
        <div className={`rounded-lg p-3 border ${
          error && !usingCache 
            ? 'bg-red-500/10 border-red-500/20' 
            : 'bg-yellow-500/10 border-yellow-500/20'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!isOnline && (
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
              <p className={`text-sm ${error && !usingCache ? 'text-red-400' : 'text-yellow-400'}`}>
                {error || (usingCache ? 'Showing cached data' : '')}
              </p>
            </div>
            
            {isOnline && (
              <button
                onClick={refetch}
                className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded text-white transition-colors"
              >
                Refresh
              </button>
            )}
          </div>
        </div>
      )}
      {/* Projects Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            projectTitle={project?.projectName || ''}
            title={project?.projectName || ''}
            description={project?.projectDescription || ''}
            projectImage={project?.projectImage || ''}
            projectGithub={project?.projectGithub || ''}
            projectLink={project?.projectLink || ''}
            projectDescription={project?.projectDescription || ''}
            projectAuthor={getAuthorName(project?.projectAuthor)}
            featured={false} // Add default value since it's required
            technologies={[]} // Add default empty array since it's required
            createdAt={project.createdAt}
            updatedAt={project.updatedAt}
          />
        ))}
      </div>
      {/* Empty State */}
      {projects.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-white/40 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-white/60">No projects available</p>
          {!isOnline && (
            <p className="text-white/40 text-sm mt-2">You're offline and no cached data is available</p>
          )}
        </div>
      )}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20 mt-6">
        <p className="text-white/70 text-sm italic">
          "Constantly learning and adapting to new technologies. The journey of a developer never ends!"
        </p>
      </div>
    </div>
  )
}
