import { Link } from '@/navigation'
import Image from 'next/image'
import { ExternalLink, Github, Eye } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ProjectWithRelations } from '@/lib/types/database'

interface ProjectCardProps {
  project: ProjectWithRelations
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    dev: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    concluido: 'bg-green-500/10 text-green-600 dark:text-green-400',
    pausado: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    arquivado: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
  }

  const statusLabels = {
    dev: 'Em Desenvolvimento',
    concluido: 'Concluído',
    pausado: 'Pausado',
    arquivado: 'Arquivado',
  }

  return (
    <Card className="group relative overflow-hidden transition-all duration-500 h-full flex flex-col hover:-translate-y-1 bg-white/40 dark:bg-white/[0.03] backdrop-blur-2xl border border-white/50 dark:border-white/10 hover:border-primary/40 shadow-xl shadow-black/5 dark:shadow-black/20 hover:shadow-2xl hover:shadow-primary/10">
      {/* Inner Glow */}
      <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-none" />
      
      {/* Gradient Shine on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden">
        {project.cover_image_url ? (
          <>
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/10 dark:from-primary/20 dark:via-purple-500/10 dark:to-blue-500/20">
            <span className="text-5xl font-bold text-zinc-300 dark:text-zinc-600">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Featured Badge */}
        {project.is_featured && (
          <Badge className="absolute top-3 left-3 bg-amber-500/80 backdrop-blur-md text-white border border-amber-400/50 shadow-lg">
            Destaque
          </Badge>
        )}
        
        {/* Status Badge */}
        <Badge 
          variant="secondary" 
          className={`absolute top-3 right-3 backdrop-blur-xl border border-white/20 shadow-lg ${statusColors[project.status]}`}
        >
          {statusLabels[project.status]}
        </Badge>
      </div>

      <CardHeader className="pb-3 relative z-10">
        <Link href={`/projetos/${project.slug}` as any}>
          <h3 className="text-xl font-bold text-zinc-800 dark:text-white hover:text-primary transition-colors line-clamp-1">
            {project.title}
          </h3>
        </Link>
        {project.subtitle && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">
            {project.subtitle}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 relative z-10">
        {project.short_description && (
          <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 mb-4">
            {project.short_description}
          </p>
        )}

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 5).map((tech) => (
              <Badge
                key={tech.id}
                variant="secondary"
                className="text-xs font-medium backdrop-blur-sm border"
                style={{ 
                  backgroundColor: `${tech.color_hex}20`, 
                  color: tech.color_hex,
                  borderColor: `${tech.color_hex}40`
                }}
              >
                {tech.name}
              </Badge>
            ))}
            {project.technologies.length > 5 && (
              <Badge variant="secondary" className="text-xs bg-white/50 dark:bg-white/10 backdrop-blur-sm text-zinc-600 dark:text-zinc-400 border border-white/60 dark:border-white/10">
                +{project.technologies.length - 5}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-1">
          {project.repo_url && (
            <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10">
              <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
          {project.deploy_url && (
            <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10">
              <a href={project.deploy_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          <Eye className="h-3.5 w-3.5" />
          <span>{project.views_count}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
