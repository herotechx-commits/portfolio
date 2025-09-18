import { usePublicAboutUser } from '@/hooks/use-public-about-user'
import React from 'react'
import { Loading } from './loading'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AboutUser() {
  const { aboutUser, loading, error, isOnline, usingCache, refetch } = usePublicAboutUser()

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      {/* Online/Offline Status and Error Banner */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-white/60">
            {isOnline ? 'Online' : 'Offline'}
          </span>
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

      {/* Error/Cache Status Banner */}
      {(error || usingCache) && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg p-3 border ${
            error && !usingCache 
              ? 'bg-red-500/10 border-red-500/20' 
              : 'bg-yellow-500/10 border-yellow-500/20'
          }`}
        >
          <div className="flex items-center gap-2">
            {!isOnline && (
              <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            )}
            <p className={`text-sm ${error && !usingCache ? 'text-red-400' : 'text-yellow-400'}`}>
              {error || (usingCache ? 'Showing cached profile data' : '')}
            </p>
          </div>
        </motion.div>
      )}

      {/* User Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-4 mb-6"
      >
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg overflow-hidden"
        >
          <Image 
            src={aboutUser?.userImg || '/default-avatar.png'} 
            alt={aboutUser?.name || 'User avatar'} 
            width={96} 
            height={96} 
            className='w-full h-full object-cover' 
          />
        </motion.div>
        
        <div className='py-5'>
          <div className="flex gap-10 items-center">
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-semibold capitalize text-white"
            >
              {aboutUser?.name}
            </motion.h3>
            
            {/* Enhanced Resume Button */}
            {aboutUser?.resume && (
              <motion.a
                href={aboutUser.resume}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(251, 191, 36, 0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="group relative overflow-hidden"
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-size-200"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ backgroundSize: "200% 200%" }}
                />
                
                {/* Button content */}
                <div className="relative z-50 px-6 py-2 rounded-2xl border border-amber-400/50 backdrop-blur-sm">
                  <motion.span 
                    className="uppercase text-red-500 font-medium text-sm tracking-wider flex items-center gap-2"
                    whileHover={{ letterSpacing: "0.2em" }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                    resume
                  </motion.span>
                  
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </div>
              </motion.a>
            )}
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 capitalize mt-1"
          >
            {aboutUser?.title}
          </motion.p>
        </div>
      </motion.div>

      {/* Bio Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-white/70 leading-relaxed capitalize">
          {aboutUser?.bio}
        </p>
      </motion.div>

      {/* Skills & Expertise Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-4 capitalize"
      >
        <h4 className="text-lg font-semibold text-white">Skills & Expertise</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aboutUser?.skillCategories?.map((cate, categoryIndex) => (
            <motion.div 
              key={cate.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + categoryIndex * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
            >
              <h5 className="text-white/80 font-medium mb-3 text-base">{cate.title}</h5>
              <div className="space-y-2">
                {cate.skills?.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + categoryIndex * 0.1 + skillIndex * 0.05 }}
                    whileHover={{ x: 5 }}
                    className="text-sm text-white/60 hover:text-white/80 transition-colors duration-200 cursor-default"
                  >
                    • {skill.name}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quote Section */}
      {aboutUser?.quote && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
        >
          <motion.p 
            className="text-white/60 italic text-center relative"
            whileHover={{ scale: 1.02 }}
          >
            {aboutUser.quote}
          </motion.p>
        </motion.div>
      )}

      {/* Empty State */}
      {!aboutUser && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-white/40 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-white/60">No profile information available</p>
          {!isOnline && (
            <p className="text-white/40 text-sm mt-2">You're offline and no cached data is available</p>
          )}
        </motion.div>
      )}
    </div>
  )
}
