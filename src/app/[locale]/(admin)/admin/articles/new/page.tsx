import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ArticleForm } from '@/components/admin/article-form'

export const metadata: Metadata = {
  title: 'Novo Artigo | Admin',
}

export default async function NewArticlePage() {
  const supabase = await createClient()

  // Fetch categories, tags, and projects for the form
  const [{ data: categories }, { data: tags }, { data: projects }] = await Promise.all([
    supabase.from('categories').select('*').order('display_order'),
    supabase.from('tags').select('*').order('name'),
    supabase.from('projects').select('id, title, slug').eq('is_active', true).order('title'),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Novo Artigo</h1>
        <p className="text-muted-foreground">Escreva um novo artigo para o blog</p>
      </div>

      <ArticleForm
        categories={categories || []}
        tags={tags || []}
        projects={projects || []}
      />
    </div>
  )
}
