'use client'

import { Link } from '@/navigation'
import Image from 'next/image'
import { ExternalLink, Github, ArrowUpRight, Eye } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import type { ProjectWithRelations } from '@/lib/types/database'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

interface ProjectCardProps {
  project: ProjectWithRelations & {
    subtitle?: string | null
    views_count?: number
  }
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className={className}
    >
      <Card className="group relative flex flex-col h-full overflow-hidden bg-card border-border/50 hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl">
        {/* Image Section */}
        <div className="relative aspect-[16/10] w-full overflow-hidden z-10 shrink-0 bg-muted">
          <Link href={`/projetos/${project.slug}` as any} className="block w-full h-full">
            {project.cover_image_url ? (
              <Image
                src={project.cover_image_url}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/50">
                <span className="text-4xl font-bold text-muted-foreground/30">{project.title.charAt(0)}</span>
              </div>
            )}
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          </Link>
          
          {/* Top Actions */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0">
            {project.repo_url && (
              <a 
                href={project.repo_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-background/90 backdrop-blur-sm rounded-full shadow-sm hover:text-primary hover:bg-background transition-colors"
                title="Ver Código"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.deploy_url && (
              <a 
                href={project.deploy_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-background/90 backdrop-blur-sm rounded-full shadow-sm hover:text-primary hover:bg-background transition-colors"
                title="Ver Projeto"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Views Count Badge (Optional) */}
          {project.views_count > 0 && (
             <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md flex items-center gap-1.5 text-xs text-white font-medium">
                <Eye className="w-3 h-3" />
                {project.views_count}
             </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="flex flex-col flex-1 p-5 space-y-3">
          <div className="space-y-1.5">
              <Link href={`/projetos/${project.slug}` as any} className="group/title block">
                <h3 className="text-xl font-bold text-foreground group-hover/title:text-primary transition-colors line-clamp-1 flex items-center gap-2">
                  {project.title}
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all duration-300 text-primary" />
                </h3>
              </Link>
              {project.subtitle && (
                <p className="text-sm text-muted-foreground line-clamp-2 font-medium">
                  {project.subtitle}
                </p>
              )}
          </div>

          {project.short_description && (
            <p className="text-xs text-muted-foreground/80 line-clamp-2 mt-2 leading-relaxed">
              {project.short_description}
            </p>
          )}

          {/* Technologies */}
          <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
            {project.technologies && project.technologies.slice(0, 4).map((tech: any) => (
              <Badge
                key={tech.id}
                variant="outline"
                className="text-[10px] px-2 py-0.5 h-6 bg-muted/30 hover:bg-muted/50 border-muted-foreground/20 transition-colors"
                style={{
                    borderColor: tech.color_hex ? `${tech.color_hex}40` : undefined,
                }}
              >
                <span 
                    className="w-1.5 h-1.5 rounded-full mr-1.5 shrink-0" 
                    style={{ backgroundColor: tech.color_hex || '#666' }}
                />
                {tech.name}
              </Badge>
            ))}
            {project.technologies && project.technologies.length > 4 && (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-6 bg-muted/30">
                +{project.technologies.length - 4}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
