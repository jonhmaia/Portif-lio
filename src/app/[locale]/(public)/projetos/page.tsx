import { Metadata } from 'next'
import Image from 'next/image'
import { ArrowUpRight, Crown, Github, ExternalLink, Star, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FlowingLights } from '@/components/ui/flowing-lights'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { getLocale } from 'next-intl/server'
import { Link } from '@/navigation'

export const metadata: Metadata = {
  title: 'Projetos | Galeria Premium',
  description: 'Uma coleção curada de projetos de engenharia de software e inteligência artificial.',
}

export default async function ProjectsPage() {
  const t = await getTranslations('projects')
  const locale = await getLocale()
  const supabase = await createClient()

  const { data: projectsData } = await supabase
    .from('projects')
    .select(`
      *,
      technologies:project_technologies(
        technology:technologies(*)
      ),
      tags:project_tags(
        tag:tags(*)
      ),
      translations:project_translations(*)
    `)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('display_order', { ascending: true })

  // Transform data to match the expected format
  const projects =
    projectsData?.map((project) => {
      const translations = project.translations || []
      const ptTranslation = translations.find((tr: any) => tr.language === 'pt-BR')
      const enTranslation = translations.find((tr: any) => tr.language === 'en')
      const currentTranslation = locale === 'en' ? enTranslation || ptTranslation : ptTranslation

      return {
        ...project,
        technologies:
          project.technologies?.map((pt: any) => pt.technology).filter(Boolean) || [],
        tags: project.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
        title: currentTranslation?.title || project.title,
        subtitle: currentTranslation?.subtitle || project.subtitle,
        short_description:
          currentTranslation?.short_description || project.short_description,
        full_description: currentTranslation?.full_description || project.full_description,
        meta_description: currentTranslation?.meta_description || project.meta_description,
        gradient: 'from-violet-600 to-indigo-600',
      }
    }) || []

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 relative overflow-hidden">
      
      {/* Background Animation - Sutileza aumentada */}
      <div className="opacity-40">
        <FlowingLights />
      </div>

      {/* Header Section - Refinado e Moderno */}
      <section className="relative pt-28 pb-16 md:pt-32 md:pb-20 px-6 md:px-12">
        <div className="container mx-auto text-center max-w-5xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-sm font-semibold tracking-wide mb-4 backdrop-blur-md shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-all duration-300">
            <Sparkles className="w-4 h-4" />
            <span>{t('premium')}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-4 leading-[1.1] bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          
          <p className="max-w-3xl mx-auto text-base md:text-lg lg:text-xl text-muted-foreground/90 leading-relaxed font-normal">
            {t.rich('subtitle', {
              emphasis: (chunks) => (
                <span className="text-foreground font-semibold">{chunks}</span>
              ),
            })}
          </p>

          {/* Stats ou informações adicionais */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>{projects.length} {projects.length === 1 ? 'Projeto' : 'Projetos'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span>{projects.filter(p => p.is_featured).length} Destaques</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid - Design Moderno com Cards Limpos */}
      <section className="container mx-auto px-6 md:px-12 pb-32">
        {projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-xl font-light">{t('empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project) => (
              <Link 
                href={`/projetos/${project.slug}`}
                key={project.id}
                className={`group flex flex-col bg-card/40 backdrop-blur-md border border-border/40 rounded-3xl overflow-hidden hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 ${project.is_featured ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                {/* Image Section - Cinematic */}
                <div className={`relative overflow-hidden ${project.is_featured ? 'aspect-[2.2/1]' : 'aspect-[1.6/1]'}`}>
                  {project.cover_image_url ? (
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
                      style={{ backgroundImage: `url(${project.cover_image_url})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
                    </div>
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20`} />
                  )}
                  
                  {/* Badges Flutuantes */}
                  <div className="absolute top-5 left-5 z-10 flex gap-2">
                    {project.is_featured && (
                      <Badge className="bg-yellow-500/90 text-white border-none shadow-lg backdrop-blur-md uppercase tracking-wider text-[10px] py-1.5 px-3 font-bold">
                        <Star className="w-3 h-3 mr-1.5 fill-current" /> {t('featured')}
                      </Badge>
                    )}
                  </div>

                  {/* External Links - Aparecem suavemente */}
                  <div className="absolute top-5 right-5 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-[-10px] group-hover:translate-y-0 delay-100">
                    {project.repo_url && (
                      <div className="rounded-full bg-background/60 backdrop-blur-xl hover:bg-background text-foreground h-10 w-10 shadow-lg border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110" onClick={(e) => e.stopPropagation()}>
                        <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                          <Github className="w-5 h-5" />
                        </a>
                      </div>
                    )}
                    {project.deploy_url && (
                      <div className="rounded-full bg-background/60 backdrop-blur-xl hover:bg-background text-foreground h-10 w-10 shadow-lg border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110" onClick={(e) => e.stopPropagation()}>
                        <a href={project.deploy_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Section - Refinado */}
                <div className="flex flex-col flex-grow p-8 space-y-6 relative">
                  {/* Seta de Ação - Decorativa */}
                  <div className="absolute top-8 right-8 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>

                  <div className="space-y-3 pr-8">
                    <h3 className="text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    {project.short_description && (
                      <p className="text-muted-foreground/70 text-base leading-relaxed line-clamp-2 font-light">
                        {project.short_description}
                      </p>
                    )}
                  </div>

                  {/* Tech Stack - Minimalista e Limpo */}
                  <div className="mt-auto pt-6 border-t border-border/20 flex items-center justify-between">
                    {project.technologies && project.technologies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech: any) => (
                          <span key={tech.id} className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100/80 dark:bg-zinc-800/50 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700/50 transition-colors group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-white">
                            {tech.name}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100/50 dark:bg-zinc-800/30 px-3 py-1.5 rounded-full border border-zinc-200/50 dark:border-zinc-700/30">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    ) : <div />}
                    
                    {/* Texto sutil "Ver Detalhes" no hover */}
                    <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0 hidden md:inline-block">
                      Ver Detalhes
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action - Moderno e Clean */}
        <div className="mt-32 text-center space-y-10 max-w-2xl mx-auto">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary/30 to-transparent mx-auto" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            {t('cta.title')}
          </h2>
          <Button size="lg" className="rounded-full px-10 py-7 text-lg bg-foreground text-background hover:bg-foreground/80 font-medium shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" asChild>
            <Link href="/contact">
              {t('cta.button')} <ArrowUpRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
