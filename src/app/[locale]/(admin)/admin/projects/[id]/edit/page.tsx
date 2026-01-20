import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectForm } from '@/components/admin/project-form'

export const metadata: Metadata = {
  title: 'Editar Projeto | Admin',
}

interface EditProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch project with relations and translations
  const { data: projectData, error } = (await supabase
    .from('projects')
    .select(`
      *,
      technologies:project_technologies(technology_id),
      tags:project_tags(tag_id),
      images:project_images(*),
      translations:project_translations(*)
    `)
    .eq('id', parseInt(id))
    .single()

  if (error || !projectData) {
    notFound()
  }

  // Get translations
  const translations = (projectData.translations || []) as Array<{ language: string; [key: string]: unknown }>
  const ptTranslation = translations.find((t) => t.language === 'pt-BR')
  const enTranslation = translations.find((t) => t.language === 'en')

  // Transform data
  const project = {
    ...projectData,
    technology_ids: (projectData.technologies as Array<{ technology_id?: number }> | null)?.map((t) => t.technology_id).filter((id): id is number => Boolean(id)) || [],
    tag_ids: (projectData.tags as Array<{ tag_id?: number }> | null)?.map((t) => t.tag_id).filter((id): id is number => Boolean(id)) || [],
    images: projectData.images || [],
    translations: {
      pt: ptTranslation || {
        title: projectData.title,
        subtitle: projectData.subtitle,
        short_description: projectData.short_description,
        full_description: projectData.full_description,
        meta_description: projectData.meta_description,
      },
      en: enTranslation || undefined,
    },
  }

  // Fetch technologies and tags for the form
  const [{ data: technologies }, { data: tags }] = await Promise.all([
    supabase.from('technologies').select('*').eq('is_active', true).order('name'),
    supabase.from('tags').select('*').order('name'),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Projeto</h1>
        <p className="text-muted-foreground">Atualize as informações do projeto em ambos os idiomas</p>
      </div>

      <ProjectForm
        project={project}
        technologies={technologies || []}
        tags={tags || []}
      />
    </div>
  )
}
