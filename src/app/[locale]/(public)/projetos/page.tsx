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

      {/* Gallery Grid - Design Moderno Aprimorado */}
      <section className="container mx-auto px-4 sm:px-6 md:px-12 pb-24 md:pb-32">
        {projects.length === 0 ? (
          <div className="text-center py-32 space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mb-4">
              <Crown className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <p className="text-xl md:text-2xl font-medium text-muted-foreground">{t('empty')}</p>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Novos projetos serão adicionados em breve. Fique atento!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {projects.map((project) => (
              <Link 
                href={`/projetos/${project.slug}`}
                key={project.id}
                className={`group relative flex flex-col bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl md:rounded-3xl overflow-hidden hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1 ${project.is_featured ? 'md:col-span-2 lg:col-span-2 ring-2 ring-primary/20' : ''}`}
              >
                {/* Image Section - Melhorado com Next Image */}
                <div className={`relative overflow-hidden ${project.is_featured ? 'aspect-[2.2/1]' : 'aspect-[16/10]'} bg-gradient-to-br from-primary/5 to-accent/5`}>
                  {project.cover_image_url ? (
                    <>
                      <Image
                        src={project.cover_image_url}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                        sizes={project.is_featured ? "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                        priority={project.is_featured}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent opacity-40" />
                  )}
                  
                  {/* Badges Flutuantes - Melhorados */}
                  <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                    {project.is_featured && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-none shadow-xl backdrop-blur-md uppercase tracking-wider text-[10px] py-1.5 px-3 font-bold animate-pulse">
                        <Star className="w-3 h-3 mr-1.5 fill-current" /> {t('featured')}
                      </Badge>
                    )}
                  </div>

                  {/* External Links - Melhorados */}
                  <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-5px] group-hover:translate-y-0">
                    {project.repo_url && (
                      <a 
                        href={project.repo_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-full bg-background/90 backdrop-blur-xl hover:bg-background text-foreground h-10 w-10 shadow-xl border border-border/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-primary"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {project.deploy_url && (
                      <a 
                        href={project.deploy_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-full bg-background/90 backdrop-blur-xl hover:bg-background text-foreground h-10 w-10 shadow-xl border border-border/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-primary"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content Section - Refinado */}
                <div className="flex flex-col flex-grow p-6 md:p-8 space-y-5 relative">
                  {/* Seta de Ação - Decorativa */}
                  <div className="absolute top-6 right-6 md:top-8 md:right-8 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500">
                    <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
                  </div>

                  <div className="space-y-3 pr-12">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {project.title}
                    </h3>
                    {project.short_description && (
                      <p className="text-muted-foreground/80 text-sm md:text-base leading-relaxed line-clamp-2 font-normal">
                        {project.short_description}
                      </p>
                    )}
                  </div>

                  {/* Tech Stack - Melhorado */}
                  <div className="mt-auto pt-5 border-t border-border/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {project.technologies && project.technologies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech: any) => (
                          <Badge 
                            key={tech.id} 
                            variant="secondary"
                            className="text-[10px] md:text-xs font-medium px-2.5 py-1 border transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/5"
                          >
                            {tech.name}
                          </Badge>
                        ))}
                        {project.technologies.length > 4 && (
                          <Badge 
                            variant="outline"
                            className="text-[10px] md:text-xs font-medium px-2.5 py-1"
                          >
                            +{project.technologies.length - 4}
                          </Badge>
                        )}
                      </div>
                    ) : <div />}
                    
                    {/* Texto sutil "Ver Detalhes" no hover */}
                    <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0 hidden sm:inline-flex items-center gap-1">
                      Ver Detalhes <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action - Melhorado */}
        {projects.length > 0 && (
          <div className="mt-24 md:mt-32 text-center space-y-8 max-w-3xl mx-auto">
            <div className="relative">
              <div className="w-px h-20 bg-gradient-to-b from-transparent via-primary/40 to-transparent mx-auto" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/40 ring-4 ring-background" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                {t('cta.title')}
              </h2>
              <p className="text-muted-foreground/70 text-sm md:text-base max-w-lg mx-auto">
                Vamos trabalhar juntos para criar algo incrível!
              </p>
            </div>
            <Button 
              size="lg" 
              className="group/btn rounded-full px-8 md:px-10 py-6 md:py-7 text-base md:text-lg bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary font-semibold shadow-xl hover:shadow-2xl hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300" 
              asChild
            >
              <Link href="/contact">
                {t('cta.button')} 
                <ArrowUpRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
              </Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
