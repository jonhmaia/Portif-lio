'use client'

import Image from 'next/image'
import { 
  Database, 
  Github, 
} from 'lucide-react'
import { SpotlightCard } from '@/components/ui/spotlight-card'

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
            <SpotlightCard 
              key={skill.name}
              className="h-32 bg-card/10 backdrop-blur-sm border-white/5 hover:border-primary/50 transition-colors"
              spotlightColor="rgba(37, 99, 235, 0.25)"
            >
              <div className="relative z-20 flex flex-col items-center justify-center h-full p-4">
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
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  )
}
