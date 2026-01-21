import { Metadata } from 'next'
import Image from 'next/image'
import { ArrowUpRight, Crown, Github, ExternalLink, Star } from 'lucide-react'
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
    (projectsData as any)?.map((project: any) => {
      const translations = (project.translations || []) as Array<{ language: string; title?: string; subtitle?: string | null; short_description?: string | null; full_description?: string | null; meta_description?: string | null }>
      const ptTranslation = translations.find((tr) => tr.language === 'pt-BR')
      const enTranslation = translations.find((tr) => tr.language === 'en')
      const currentTranslation = locale === 'en' ? enTranslation || ptTranslation : ptTranslation

      return {
        ...project,
        technologies:
          (project.technologies as any)?.map((pt: { technology: unknown } | null) => pt?.technology).filter(Boolean) || [],
        tags: (project.tags as any)?.map((pt: { tag: unknown } | null) => pt?.tag).filter(Boolean) || [],
        title: currentTranslation?.title || (project as any).title,
        subtitle: currentTranslation?.subtitle || (project as any).subtitle,
        short_description:
          currentTranslation?.short_description || (project as any).short_description,
        full_description: currentTranslation?.full_description || (project as any).full_description,
        meta_description: currentTranslation?.meta_description || (project as any).meta_description,
        gradient: 'from-violet-600 to-indigo-600',
      }
    }) || []

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 relative overflow-hidden selection:bg-primary/30">
      
      {/* Background Animation & Gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[100px]" />
      </div>
      <div className="opacity-60 fixed inset-0 pointer-events-none z-0">
        <FlowingLights />
      </div>

      {/* Header Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 z-10">
        <div className="container mx-auto text-center max-w-5xl space-y-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/40 mb-6 drop-shadow-sm">
            {t('title')}
          </h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {projects.map((project: any) => (
              <Link 
                href={`/projetos/${project.slug}` as any}
                key={project.id}
                className={`group relative flex flex-col rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${project.is_featured ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                {/* Glassmorphism Card Container */}
                <div className="absolute inset-0 bg-white/40 dark:bg-white/[0.03] backdrop-blur-2xl rounded-3xl" />
                
                {/* Glass Border Effect */}
                <div className="absolute inset-0 rounded-3xl border border-white/50 dark:border-white/10 group-hover:border-primary/40 transition-colors duration-500" />
                
                {/* Inner Glow */}
                <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
                
                {/* Outer Shadow */}
                <div className="absolute inset-0 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/20 group-hover:shadow-2xl group-hover:shadow-primary/20 transition-shadow duration-500" />
                
                {/* Gradient Shine on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />

                {/* Image Section */}
                <div className={`relative overflow-hidden ${project.is_featured ? 'aspect-[2/1]' : 'aspect-[4/3]'} w-full z-10`}>
                  {project.cover_image_url ? (
                    <>
                      <Image
                        src={project.cover_image_url}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                        sizes={project.is_featured ? "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                        priority={project.is_featured}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/10 dark:from-primary/20 dark:via-purple-500/10 dark:to-blue-500/20" />
                  )}
                  
                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                    {project.is_featured && (
                      <Badge className="bg-amber-500/80 backdrop-blur-md text-white border border-amber-400/50 uppercase tracking-wider text-[10px] py-1 px-3 font-bold shadow-lg">
                        <Star className="w-3 h-3 mr-1.5 fill-current" /> {t('featured')}
                      </Badge>
                    )}
                  </div>

                  {/* External Links */}
                  <div className="absolute top-4 right-4 z-10 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {project.repo_url && (
                      <span 
                        className="rounded-full bg-white/20 backdrop-blur-xl text-white h-9 w-9 flex items-center justify-center border border-white/30 hover:bg-primary hover:border-primary transition-colors shadow-lg"
                      >
                        <Github className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-grow p-6 md:p-8 space-y-4 relative z-10">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-zinc-800 dark:text-white tracking-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {project.title}
                    </h3>
                    {project.short_description && (
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2">
                        {project.short_description}
                      </p>
                    )}
                  </div>

                  {/* Tech Stack */}
                  <div className="mt-auto pt-4 flex items-center justify-between gap-4">
                    {project.technologies && project.technologies.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 3).map((tech: any) => (
                          <div 
                            key={tech.id} 
                            className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-white/60 dark:border-white/10 text-zinc-700 dark:text-zinc-300"
                          >
                            {tech.name}
                          </div>
                        ))}
                        {project.technologies.length > 3 && (
                          <div className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-white/60 dark:border-white/10 text-zinc-600 dark:text-zinc-400">
                            +{project.technologies.length - 3}
                          </div>
                        )}
                      </div>
                    ) : <div />}
                    
                    <div className="rounded-full p-2.5 bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-white/60 dark:border-white/20 text-zinc-600 dark:text-zinc-300 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300 shadow-sm">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {projects.length > 0 && (
          <div className="mt-20 text-center space-y-8 max-w-2xl mx-auto relative z-10">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary/30 to-transparent mx-auto" />
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                {t('cta.title')}
              </h2>
              <p className="text-muted-foreground/70 text-base max-w-lg mx-auto">
                Vamos trabalhar juntos para criar algo incrível!
              </p>
            </div>
            <Button 
              size="lg" 
              className="rounded-full px-8 py-6 text-base bg-white/40 dark:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/20 text-zinc-800 dark:text-white hover:bg-white/60 dark:hover:bg-white/20 hover:scale-105 hover:border-primary/50 transition-all duration-300 shadow-xl shadow-black/5 dark:shadow-black/20 font-semibold" 
              asChild
            >
              <Link href="/contact">
                {t('cta.button')} 
                <ArrowUpRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
