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
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 h-full flex flex-col">
      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <span className="text-4xl font-bold opacity-20">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Featured Badge */}
        {project.is_featured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            Destaque
          </Badge>
        )}
        
        {/* Status Badge */}
        <Badge 
          variant="secondary" 
          className={`absolute top-3 right-3 ${statusColors[project.status]}`}
        >
          {statusLabels[project.status]}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <Link href={`/projetos/${project.slug}`}>
          <h3 className="text-xl font-bold hover:text-primary transition-colors line-clamp-1">
            {project.title}
          </h3>
        </Link>
        {project.subtitle && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            {project.subtitle}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        {project.short_description && (
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
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
                className="text-xs"
                style={{ 
                  backgroundColor: `${tech.color_hex}15`, 
                  color: tech.color_hex,
                  borderColor: `${tech.color_hex}30`
                }}
              >
                {tech.name}
              </Badge>
            ))}
            {project.technologies.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{project.technologies.length - 5}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {project.repo_url && (
            <Button asChild variant="ghost" size="sm" className="h-8 px-2">
              <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
          {project.deploy_url && (
            <Button asChild variant="ghost" size="sm" className="h-8 px-2">
              <a href={project.deploy_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="h-4 w-4" />
          <span>{project.views_count}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
