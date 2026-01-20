import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArticleForm } from '@/components/admin/article-form'

export const metadata: Metadata = {
  title: 'Editar Artigo | Admin',
}

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch article with relations and translations
  const { data: articleData, error } = (await supabase
    .from('articles')
    .select(`
      *,
      tags:article_tags(tag_id),
      projects:article_projects(project_id),
      translations:article_translations(*)
    `)
    .eq('id', parseInt(id))
    .single()

  if (error || !articleData) {
    notFound()
  }

  // Get translations
  const translations = (articleData.translations || []) as Array<{ language: string; [key: string]: unknown }>
  const ptTranslation = translations.find((t) => t.language === 'pt-BR')
  const enTranslation = translations.find((t) => t.language === 'en')

  // Transform data
  const article = {
    ...articleData,
    tag_ids: (articleData.tags as Array<{ tag_id?: number }> | null)?.map((t) => t.tag_id).filter((id): id is number => Boolean(id)) || [],
    project_ids: (articleData.projects as Array<{ project_id?: number }> | null)?.map((p) => p.project_id).filter((id): id is number => Boolean(id)) || [],
    translations: {
      pt: ptTranslation || {
        title: articleData.title,
        content: articleData.content,
        summary: articleData.summary,
        excerpt: articleData.excerpt,
        meta_description: articleData.meta_description,
      },
      en: enTranslation || undefined,
    },
  }

  // Fetch categories, tags, and projects for the form
  const [{ data: categories }, { data: tags }, { data: projects }] = await Promise.all([
    supabase.from('categories').select('*').order('display_order'),
    supabase.from('tags').select('*').order('name'),
    supabase.from('projects').select('id, title, slug').eq('is_active', true).order('title'),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Artigo</h1>
        <p className="text-muted-foreground">Atualize o conteúdo do artigo em ambos os idiomas</p>
      </div>

      <ArticleForm
        article={article}
        categories={categories || []}
        tags={tags || []}
        projects={projects || []}
      />
    </div>
  )
}
