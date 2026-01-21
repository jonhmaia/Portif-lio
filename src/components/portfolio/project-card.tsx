import { Link } from '@/navigation'
import Image from 'next/image'
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { ProjectWithRelations } from '@/lib/types/database'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: ProjectWithRelations & {
    subtitle?: string | null
    views_count?: number
  }
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Card className={cn(
      "group relative flex flex-col h-full overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl",
      className
    )}>
      {/* Image Section - Smaller height */}
      <div className="relative h-32 w-full overflow-hidden z-10 shrink-0 bg-zinc-100 dark:bg-zinc-800">
        <Link href={`/projetos/${project.slug}` as any} className="block w-full h-full">
          {project.cover_image_url ? (
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
              <span className="text-2xl font-bold text-zinc-300 dark:text-zinc-700">{project.title.charAt(0)}</span>
            </div>
          )}
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </Link>
        
        {/* Hover Actions */}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.repo_url && (
            <a 
              href={project.repo_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 bg-white/90 dark:bg-zinc-900/90 rounded-full shadow-sm hover:text-primary transition-colors"
              title="Ver Código"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
          {project.deploy_url && (
            <a 
              href={project.deploy_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 bg-white/90 dark:bg-zinc-900/90 rounded-full shadow-sm hover:text-primary transition-colors"
              title="Ver Projeto"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Content Section - Simplified */}
      <CardContent className="flex flex-col flex-1 p-3 space-y-1.5">
        <div className="space-y-0.5">
            <Link href={`/projetos/${project.slug}` as any} className="group/title block">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover/title:text-primary transition-colors line-clamp-1 flex items-center gap-1.5">
                {project.title}
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all duration-300" />
              </h3>
            </Link>
            {project.subtitle && (
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1 font-medium">
                {project.subtitle}
              </p>
            )}
        </div>

        {/* Minimal Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1 mt-auto">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech.id}
                className="text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
              >
                {tech.name}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-[9px] px-1.5 py-0.5 text-zinc-400">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
