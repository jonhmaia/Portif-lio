'use client'

import Image from 'next/image'
import { 
  Database, 
  Server, 
  Github, 
  Code2, 
  Cpu, 
  Globe, 
  Layout, 
  Box, 
  Workflow, 
  Terminal,
  Layers,
  Zap
} from 'lucide-react'

// Simple SVG Icons for skills without images
const SupabaseIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor" color="#3ECF8E">
    <path d="M12 2L2 12h8v10l10-10h-8V2z"/>
  </svg>
)

interface Skill {
  name: string
  imageSrc?: string
  icon?: React.ElementType
}

const skills: Skill[] = [
  { name: 'Python', imageSrc: '/python.png' },
  { name: 'JavaScript', imageSrc: '/javascript.png' },
  { name: 'Django', imageSrc: '/django.png' },
  { name: 'Node.js', imageSrc: '/nodejs.png' },
  { name: 'HTML5', imageSrc: '/html.png' },
  { name: 'CSS3', imageSrc: '/css.png' },
  { name: 'PostgreSQL', imageSrc: '/postgres.png' },
  { name: 'Docker', imageSrc: '/docker.png' },
  { name: 'N8N', imageSrc: '/N8n.png' },
  { name: 'Bubble.io', imageSrc: '/bubbleio.png' },
  { name: 'Supabase', icon: SupabaseIcon },
  { name: 'C/C++', imageSrc: '/c.png' },
  { name: 'SQL', icon: Database },
  { name: 'MCP', imageSrc: '/mcp.png' },
  { name: 'GitHub', icon: Github },
  { name: 'Lovable', imageSrc: '/lovable.png' },
  { name: 'Flutter', imageSrc: '/flutter.png' },
  { name: 'Bootstrap', imageSrc: '/bootsstrap.png' },
]

import { useTranslations } from 'next-intl'

export function TechSkills() {
  const t = useTranslations('home.techSkills')

  return (
    <section className="py-20 md:py-32 relative z-10">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t('title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {skills.map((skill) => (
            <div 
              key={skill.name}
              className="group relative flex flex-col items-center justify-center p-6 h-32 rounded-xl bg-[#1A1F2B]/80 border border-white/5 hover:border-primary/20 hover:bg-[#1A1F2B] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Icon Container */}
              <div className="mb-3 relative w-10 h-10 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                {skill.imageSrc ? (
                  <div className="relative w-full h-full">
                    <Image 
                      src={skill.imageSrc} 
                      alt={skill.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  skill.icon && <skill.icon className="w-8 h-8" />
                )}
              </div>
              
              {/* Skill Name */}
              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
                {skill.name}
              </span>

              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
