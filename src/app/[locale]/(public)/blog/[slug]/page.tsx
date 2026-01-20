import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { MarkdownRenderer } from '@/components/blog/markdown-renderer'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/navigation'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye,
  Share2,
  Twitter,
  Linkedin,
  Facebook
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const supabase = await createClient()

  const { data: article } = (await supabase
    .from('articles')
    .select('title, summary, meta_description, cover_image_url, translations:article_translations(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()) as any

  if (!article) {
    return { title: locale === 'en' ? 'Article not found' : 'Artigo não encontrado' }
  }

  const translations = (article as any).translations || []
  const ptTranslation = translations.find((tr: any) => tr.language === 'pt-BR')
  const enTranslation = translations.find((tr: any) => tr.language === 'en')
  const currentTranslation = locale === 'en' ? enTranslation || ptTranslation : ptTranslation

  const title = currentTranslation?.title || article.title
  const description =
    currentTranslation?.meta_description ||
    currentTranslation?.summary ||
    article.meta_description ||
    article.summary ||
    ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: article.cover_image_url ? [article.cover_image_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: article.cover_image_url ? [article.cover_image_url] : [],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const t = await getTranslations('blogArticle')
  const supabase = await createClient()

  // Get article with relations
  const { data: articleData, error } = (await supabase
    .from('articles')
    .select(`
      *,
      author:profiles(*),
      category:categories(*, translations:category_translations(*)),
      tags:article_tags(
        tag:tags(*)
      ),
      projects:article_projects(
        project:projects(id, title, slug, cover_image_url)
      ),
      translations:article_translations(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()) as any

  if (error || !articleData) {
    notFound()
  }

  // Transform the data
  const article = {
    ...articleData,
    tags: articleData.tags?.map((at: any) => at.tag).filter(Boolean) || [],
    projects: articleData.projects?.map((ap: any) => ap.project).filter(Boolean) || [],
  }

  const translations = article.translations || []
  const ptTranslation = translations.find((tr: any) => tr.language === 'pt-BR')
  const enTranslation = translations.find((tr: any) => tr.language === 'en')
  const currentTranslation = locale === 'en' ? enTranslation || ptTranslation : ptTranslation

  if (currentTranslation) {
    article.title = currentTranslation.title || article.title
    article.summary = currentTranslation.summary || article.summary
    article.content = currentTranslation.content || article.content
    article.meta_description = currentTranslation.meta_description || article.meta_description
  }

  const categoryTranslations = article.category?.translations || []
  const ptCategory = categoryTranslations.find((tr: any) => tr.language === 'pt-BR')
  const enCategory = categoryTranslations.find((tr: any) => tr.language === 'en')
  const currentCategory = locale === 'en' ? enCategory || ptCategory : ptCategory

  if (article.category && currentCategory) {
    article.category.name = currentCategory.name || article.category.name
    article.category.description =
      currentCategory.description || article.category.description
  }

  // Increment view count
  await (supabase as any).rpc('increment_article_views', { article_id: article.id })

  const authorInitials = article.author?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AU'

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <article className="container py-12 md:py-16">
      {/* Back button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('back')}
      </Link>

      <div className="max-w-4xl mx-auto">
        {/* Category Badge */}
        {article.category && (
          <Badge
            className="mb-4"
            style={{
              backgroundColor: article.category.color_hex,
              color: '#fff',
            }}
          >
            {article.category.name}
          </Badge>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          {article.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-muted-foreground">
          {/* Author */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={article.author?.avatar_url || undefined} />
              <AvatarFallback>{authorInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">
                {article.author?.full_name || 'Autor'}
              </p>
              {publishedDate && (
                <p className="text-sm">{publishedDate}</p>
              )}
            </div>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Reading Time */}
          {article.reading_time_minutes && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{article.reading_time_minutes} min de leitura</span>
            </div>
          )}

          {/* Views */}
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{article.views_count} visualizações</span>
          </div>
        </div>

        {/* Cover Image */}
        {article.cover_image_url && (
          <div className="relative aspect-video rounded-xl overflow-hidden border border-border mb-10">
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {article.tags.map((tag: any) => (
              <Link key={tag.id} href={`/blog?tag=${tag.slug}` as any}>
                <Badge variant="secondary" className="hover:bg-accent">
                  #{tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="mb-12">
          <MarkdownRenderer content={article.content} />
        </div>

        <Separator className="my-10" />

        {/* Related Projects */}
        {article.projects && article.projects.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Projetos Relacionados</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {article.projects.map((project: any) => (
                <Link key={project.id} href={`/projetos/${project.slug}` as any}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      {project.cover_image_url && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={project.cover_image_url}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Ver projeto →
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Card */}
        {article.author && (
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={article.author.avatar_url || undefined} />
                  <AvatarFallback className="text-xl">{authorInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg">{article.author.full_name}</h3>
                  {article.author.bio && (
                    <p className="text-muted-foreground mt-1">
                      {article.author.bio}
                    </p>
                  )}
                  <div className="flex gap-2 mt-3">
                    {article.author.github_url && (
                      <Button asChild variant="ghost" size="sm">
                        <a href={article.author.github_url} target="_blank" rel="noopener noreferrer">
                          GitHub
                        </a>
                      </Button>
                    )}
                    {article.author.linkedin_url && (
                      <Button asChild variant="ghost" size="sm">
                        <a href={article.author.linkedin_url} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </article>
  )
}
