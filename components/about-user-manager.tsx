'use client'

import React, { useState, useEffect } from 'react'
import { useAboutUser } from '@/hooks/use-about-user'
import { CreateAboutUserData } from '@/types'
import { Edit2, User, Save, X, Plus, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

export default function AboutUserManager() {
  const { aboutUser, loading, error, saveAboutUser } = useAboutUser()
  const [formData, setFormData] = useState<CreateAboutUserData>({
    name: '',
    title: '',
    resume: '',
    bio: '',
    quote: '',
    userImg: '',
    resumeSummary: '',
    skillCategories: []
  })

  // Additional state variables that were missing
  const [isEditing, setIsEditing] = useState(false)
  const [newSkillCategory, setNewSkillCategory] = useState('')
  const [newSkill, setNewSkill] = useState('')
  const [editingSkillCategory, setEditingSkillCategory] = useState<string | null>(null)
  const [editingSkill, setEditingSkill] = useState<string | null>(null)
  const [originalFormData, setOriginalFormData] = useState<CreateAboutUserData>({
    name: '',
    title: '',
    resume: '',
    bio: '',
    quote: '',
    userImg: '',
    skillCategories: []
  })
  const { successToast } = useToast();

  useEffect(() => {
    if (aboutUser) {
      const userData = {
        name: aboutUser.name || '',
        title: aboutUser.title || '',
        resume: aboutUser.resume || '',
        bio: aboutUser.bio || '',
        quote: aboutUser.quote || '',
        userImg: aboutUser.userImg || '',
        skillCategories: aboutUser.skillCategories || []
      }
      setFormData(userData)
      setOriginalFormData(userData)
    }
  }, [aboutUser])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const saveMainData = async () => {
    try {
      await saveAboutUser(formData)
      setOriginalFormData(formData)
      setIsEditing(false)
      successToast('About user info saved successfully!')
    } catch (error) {
      console.error('Error saving about user:', error)
    }
  }

  const cancelEdit = () => {
    setFormData(originalFormData)
    setIsEditing(false)
  }

  const addSkillCategory = () => {
    if (!newSkillCategory.trim()) return
    
    setFormData(prev => ({
      ...prev,
      skillCategories: [
        ...(prev.skillCategories || []),
        { id: Date.now().toString(), title: newSkillCategory, skills: [] }
      ]
    }))
    setNewSkillCategory('')
  }

  const updateSkillCategory = (categoryId: string, title: string) => {
    setFormData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories?.map(cat =>
        cat.id === categoryId ? { ...cat, title } : cat
      ) || []
    }))
    setEditingSkillCategory(null)
  }

  const deleteSkillCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories?.filter(cat => cat.id !== categoryId) || []
    }))
  }

  const addSkillToCategory = (categoryId: string) => {
    if (!newSkill.trim()) return
    
    setFormData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories?.map(cat =>
        cat.id === categoryId
          ? { ...cat, skills: [...cat.skills, { id: Date.now().toString(), name: newSkill }] }
          : cat
      ) || []
    }))
    setNewSkill('')
  }

  const updateSkill = (categoryId: string, skillId: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories?.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              skills: cat.skills.map(skill =>
                skill.id === skillId ? { ...skill, name } : skill
              )
            }
          : cat
      ) || []
    }))
    setEditingSkill(null)
  }

  const deleteSkill = (categoryId: string, skillId: string) => {
    setFormData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories?.map(cat =>
        cat.id === categoryId
          ? { ...cat, skills: cat.skills.filter(skill => skill.id !== skillId) }
          : cat
      ) || []
    }))
  }

  if (loading) return <div className="text-center">Loading about user info...</div>
  if (error) return <div className="text-red-600">Error: {error}</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <User className="h-8 w-8" />
          About Me Manager
        </h1>
        
        {/* Preview Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Preview</h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              {/* <div className={`w-40 h-40 rounded-xl bg-gradient-to-r ${formData.userImg || 'from-purple-500 to-pink-500'}`}></div> */}
              <Image src={aboutUser?.userImg || ''} alt='' width={100} height={100} className='w-[50%] rounded-2xl h-full object-contain' />
              <div className='mb-24'>
                <h3 className="text-xl font-semibold text-white">{formData.name || 'Your Name'}</h3>
                <p className="text-white/60">{formData.title || 'Your Title'}</p>
              </div>
            </div>
            
            {formData.resumeSummary && (
              <p className="text-white/70 leading-relaxed mb-4">{formData.resumeSummary}</p>
            )}
            {formData.resume ? (
              <div className="mb-4">
                <a 
                  href={formData.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
                >
                  Download Full Resume (PDF)
                </a>
              </div>
            ) : (
              <div className="mb-4">
                <span className="text-white/50 italic">No resume uploaded</span>
              </div>
            )}
            <p className="text-white/70 leading-relaxed">{formData.bio || 'Your bio will appear here...'}</p>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Skills & Expertise</h4>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {formData.skillCategories?.map(category => (
                  <div key={category.id}>
                    <h5 className="text-white/80 font-medium mb-2">{category.title}</h5>
                    <ul className="text-sm text-white/60 space-y-1">
                      {category.skills.map(skill => (
                        <li key={skill.id}>• {skill.name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
              <p className="text-white/60 italic text-center">&quot;{formData.quote || 'Your inspirational quote here...'}&quot;</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Edit Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={saveMainData}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Basic Information Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-white mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Profile Image (Gradient Classes)</label>
              <input
                type="text"
                value={formData.userImg}
                onChange={(e) => handleInputChange('userImg', e.target.value)}
                disabled={!isEditing}
                placeholder="from-purple-500 to-pink-500"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50"
              />
            </div>
            <div>
            <label className="block text-white mb-2">Resume Summary (Optional)</label>
            <textarea
              value={formData.resumeSummary || ''}
              onChange={(e) => handleInputChange('resumeSummary', e.target.value)}
              disabled={!isEditing}
              rows={3}
              placeholder="Brief professional summary or key highlights..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            />
          </div>
            <div>
              <label className="block text-white mb-2">Resume/CV Summary</label>
              <textarea
                value={formData.resume}
                onChange={(e) => handleInputChange('resume', e.target.value)}
                disabled={!isEditing}
                rows={4}
                placeholder="Brief summary of your professional experience and qualifications..."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                rows={4}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Quote</label>
              <textarea
                value={formData.quote}
                onChange={(e) => handleInputChange('quote', e.target.value)}
                disabled={!isEditing}
                rows={2}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Skills Management */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mt-8 border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Skills Management</h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                placeholder="New category name"
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                onKeyPress={(e) => e.key === 'Enter' && addSkillCategory()}
              />
              <button
                onClick={addSkillCategory}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {formData.skillCategories?.map(category => (
              <div key={category.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                <div className="flex justify-between items-center mb-4">
                  {editingSkillCategory === category.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        defaultValue={category.title}
                        onBlur={(e) => updateSkillCategory(category.id, e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && updateSkillCategory(category.id, e.currentTarget.value)}
                        className="px-3 py-1 bg-slate-600 border border-slate-500 rounded text-white"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <h3
                      className="text-lg font-medium text-white cursor-pointer hover:text-purple-300"
                      onClick={() => setEditingSkillCategory(category.id)}
                    >
                      {category.title}
                    </h3>
                  )}
                  <button
                    onClick={() => deleteSkillCategory(category.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  {category.skills.map(skill => (
                    <div key={skill.id} className="flex justify-between items-center bg-slate-600/20 rounded px-3 py-2">
                      {editingSkill === skill.id ? (
                        <input
                          type="text"
                          defaultValue={skill.name}
                          onBlur={(e) => updateSkill(category.id, skill.id, e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && updateSkill(category.id, skill.id, e.currentTarget.value)}
                          className="flex-1 px-2 py-1 bg-slate-500 border border-slate-400 rounded text-white text-sm"
                          autoFocus
                        />
                      ) : (
                        <span
                          className="text-white/80 cursor-pointer hover:text-white text-sm"
                          onClick={() => setEditingSkill(skill.id)}
                        >
                          • {skill.name}
                        </span>
                      )}
                      <button
                        onClick={() => deleteSkill(category.id, skill.id)}
                        className="text-red-400 hover:text-red-300 p-1 ml-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add new skill"
                    className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && addSkillToCategory(category.id)}
                  />
                  <button
                    onClick={() => addSkillToCategory(category.id)}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}