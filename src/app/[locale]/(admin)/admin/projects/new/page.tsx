import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProjectForm } from '@/components/admin/project-form'

export const metadata: Metadata = {
  title: 'Novo Projeto | Admin',
}

export default async function NewProjectPage() {
  const supabase = await createClient()

  // Fetch technologies and tags for the form
  const [{ data: technologies }, { data: tags }] = await Promise.all([
    supabase.from('technologies').select('*').eq('is_active', true).order('name'),
    supabase.from('tags').select('*').order('name'),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Novo Projeto</h1>
        <p className="text-muted-foreground">Adicione um novo projeto ao seu portfólio</p>
      </div>

      <ProjectForm
        technologies={technologies || []}
        tags={tags || []}
      />
    </div>
  )
}
