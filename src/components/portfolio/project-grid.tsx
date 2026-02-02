'use client'

import { motion } from 'framer-motion'
import { ProjectCard } from './project-card'

interface ProjectGridProps {
  projects: any[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
    >
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          className="h-full"
        />
      ))}
    </motion.div>
  )
}
