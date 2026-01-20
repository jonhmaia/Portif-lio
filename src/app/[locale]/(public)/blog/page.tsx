import { Suspense } from 'react'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ArticleCard } from '@/components/blog/article-card'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artigos sobre desenvolvimento web, programação, tecnologia e dicas para desenvolvedores.',
}

interface BlogPageProps {
  searchParams: Promise<{ category?: string; tag?: string }>
}

async function ArticlesGrid({ category, tag }: { category?: string; tag?: string }) {
  const t = await getTranslations('blog')
  const locale = await getLocale()
  const supabase = await createClient()

  let query = supabase
    .from('articles')
    .select(`
      *,
      author:profiles(*),
      category:categories(*, translations:category_translations(*)),
      tags:article_tags(
        tag:tags(*)
      ),
      translations:article_translations(*)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category.slug', category)
  }

  const { data: articlesData } = await query

  // Transform and filter articles
  let articles =
    articlesData?.map((article) => {
      const translations = article.translations || []
      const ptTranslation = translations.find((tr: any) => tr.language === 'pt-BR')
      const enTranslation = translations.find((tr: any) => tr.language === 'en')
      const currentTranslation = locale === 'en' ? enTranslation || ptTranslation : ptTranslation

      const categoryTranslations = article.category?.translations || []
      const ptCategory = categoryTranslations.find((tr: any) => tr.language === 'pt-BR')
      const enCategory = categoryTranslations.find((tr: any) => tr.language === 'en')
      const currentCategory = locale === 'en' ? enCategory || ptCategory : ptCategory

      return {
        ...article,
        tags: article.tags?.map((at: any) => at.tag).filter(Boolean) || [],
        title: currentTranslation?.title || article.title,
        summary: currentTranslation?.summary || article.summary,
        content: currentTranslation?.content || article.content,
        meta_description: currentTranslation?.meta_description || article.meta_description,
        category: article.category
          ? {
              ...article.category,
              name: currentCategory?.name || article.category.name,
              description: currentCategory?.description || article.category.description,
            }
          : null,
      }
    }) || []

  if (tag) {
    articles = articles.filter((a) =>
      a.tags?.some((t: any) => t.slug === tag)
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t('empty.title')}</h3>
        <p className="text-muted-foreground">
          {category || tag
            ? t('empty.filtered')
            : t('empty.default')}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}

function ArticlesLoading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-lg border border-border/50 overflow-hidden">
          <Skeleton className="aspect-[16/10] w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category, tag } = await searchParams
  const t = await getTranslations('blog')

  return (
    <div className="container py-12 md:py-16">
      {/* Header */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-muted-foreground text-lg">
          {t('subtitle')}
        </p>
      </div>

      {/* Articles Grid */}
      <Suspense fallback={<ArticlesLoading />}>
        <ArticlesGrid category={category} tag={tag} />
      </Suspense>
    </div>
  )
}
