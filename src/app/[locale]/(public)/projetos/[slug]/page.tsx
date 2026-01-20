import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Calendar, 
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('title, short_description, meta_description, cover_image_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!project) {
    return { title: 'Projeto não encontrado' }
  }

  return {
    title: project.title,
    description: project.meta_description || project.short_description || '',
    openGraph: {
      title: project.title,
      description: project.meta_description || project.short_description || '',
      images: project.cover_image_url ? [project.cover_image_url] : [],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Get project with relations
  const { data: projectData, error } = await supabase
    .from('projects')
    .select(`
      *,
      technologies:project_technologies(
        technology:technologies(*)
      ),
      tags:project_tags(
        tag:tags(*)
      ),
      images:project_images(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !projectData) {
    notFound()
  }

  // Transform the data
  const project = {
    ...projectData,
    technologies: (projectData.technologies as Array<{ technology: unknown }> | null)?.map((pt) => pt.technology).filter(Boolean) || [],
    tags: (projectData.tags as Array<{ tag: unknown }> | null)?.map((pt) => pt.tag).filter(Boolean) || [],
    images: projectData.images || [],
  }

  // Increment view count
  await supabase.rpc('increment_project_views', { project_id: project.id })

  const statusLabels = {
    dev: 'Em Desenvolvimento',
    concluido: 'Concluído',
    pausado: 'Pausado',
    arquivado: 'Arquivado',
  }

  const statusColors = {
    dev: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    concluido: 'bg-green-500/10 text-green-600 dark:text-green-400',
    pausado: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    arquivado: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
  }

  return (
    <article className="container py-12 md:py-16">
      {/* Back button */}
      <Link
        href="/projetos"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos projetos
      </Link>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cover Image */}
          {project.cover_image_url && (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
              <Image
                src={project.cover_image_url}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Title and Subtitle */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{project.title}</h1>
            {project.subtitle && (
              <p className="text-xl text-muted-foreground">{project.subtitle}</p>
            )}
          </div>

          {/* Description */}
          {project.full_description && (
            <div className="prose-custom">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.full_description}
              </ReactMarkdown>
            </div>
          )}

          {/* Gallery */}
          {project.images && project.images.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Galeria</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.images
                  .sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
                  .map((image: { id: number; image_url: string; caption?: string | null; display_order: number }) => (
                    <div
                      key={image.id}
                      className="relative aspect-video rounded-lg overflow-hidden border border-border"
                    >
                      <Image
                        src={image.image_url}
                        alt={image.caption || project.title}
                        fill
                        className="object-cover"
                      />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                          <p className="text-white text-sm">{image.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              {project.deploy_url && (
                <Button asChild className="w-full" size="lg">
                  <a href={project.deploy_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver Demo
                  </a>
                </Button>
              )}
              {project.repo_url && (
                <Button asChild variant="outline" className="w-full" size="lg">
                  <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Ver Código
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              {/* Status */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
                <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                  {statusLabels[project.status as keyof typeof statusLabels]}
                </Badge>
              </div>

              <Separator />

              {/* Date */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Criado em</h3>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  {new Date(project.created_at).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>

              <Separator />

              {/* Views */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Visualizações</h3>
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4" />
                  {project.views_count}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technologies Card */}
          {project.technologies && project.technologies.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Tecnologias</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech: any) => (
                    <Badge
                      key={tech.id}
                      variant="secondary"
                      style={{
                        backgroundColor: `${tech.color_hex}15`,
                        color: tech.color_hex,
                      }}
                    >
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags Card */}
          {project.tags && project.tags.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: any) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      style={{ borderColor: tag.color_hex, color: tag.color_hex }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </article>
  )
}
