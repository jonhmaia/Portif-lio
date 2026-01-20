import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/projects/[id] - Get a single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang') || 'pt-BR'
    const include_translations = searchParams.get('include_translations') === 'true'

    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        technologies:project_technologies(
          technology:technologies(*)
        ),
        tags:project_tags(
          tag:tags(*)
        ),
        images:project_images(*),
        translations:project_translations(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get translations
    const translations = data.translations || []
    const ptTranslation = translations.find((t: any) => t.language === 'pt-BR')
    const enTranslation = translations.find((t: any) => t.language === 'en')
    const currentTranslation = lang === 'en' ? (enTranslation || ptTranslation) : ptTranslation

    // Get technology and tag IDs for the form
    const technology_ids = data.technologies?.map((pt: any) => pt.technology?.id).filter(Boolean) || []
    const tag_ids = data.tags?.map((pt: any) => pt.tag?.id).filter(Boolean) || []

    const baseProject = {
      ...data,
      technologies: data.technologies?.map((pt: any) => pt.technology) || [],
      tags: data.tags?.map((pt: any) => pt.tag) || [],
      technology_ids,
      tag_ids,
    }

    if (include_translations) {
      // Return all translations for admin
      return NextResponse.json({
        data: {
          ...baseProject,
          translations: {
            pt: ptTranslation || null,
            en: enTranslation || null,
          },
        },
      })
    } else {
      // Return merged data with current language translation
      return NextResponse.json({
        data: {
          ...baseProject,
          title: currentTranslation?.title || data.title,
          subtitle: currentTranslation?.subtitle || data.subtitle,
          short_description: currentTranslation?.short_description || data.short_description,
          full_description: currentTranslation?.full_description || data.full_description,
          meta_description: currentTranslation?.meta_description || data.meta_description,
        },
      })
    }
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { technology_ids, tag_ids, translations, ...projectData } = body

    // Validate required fields
    if (!translations?.pt?.title) {
      return NextResponse.json({ error: 'Título (PT-BR) é obrigatório' }, { status: 400 })
    }

    // Update the project (update legacy fields with PT translation)
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .update({
        ...projectData,
        title: translations.pt.title,
        subtitle: translations.pt.subtitle,
        short_description: translations.pt.short_description,
        full_description: translations.pt.full_description,
        meta_description: translations.pt.meta_description,
      })
      .eq('id', id)
      .select()
      .single()

    if (projectError) {
      return NextResponse.json({ error: projectError.message }, { status: 500 })
    }

    // Update PT-BR translation (upsert)
    await supabase.from('project_translations').upsert({
      project_id: parseInt(id),
      language: 'pt-BR',
      title: translations.pt.title,
      subtitle: translations.pt.subtitle || null,
      short_description: translations.pt.short_description || null,
      full_description: translations.pt.full_description || null,
      meta_description: translations.pt.meta_description || null,
    }, { onConflict: 'project_id,language' })

    // Handle EN translation
    if (translations.en?.title) {
      await supabase.from('project_translations').upsert({
        project_id: parseInt(id),
        language: 'en',
        title: translations.en.title,
        subtitle: translations.en.subtitle || null,
        short_description: translations.en.short_description || null,
        full_description: translations.en.full_description || null,
        meta_description: translations.en.meta_description || null,
      }, { onConflict: 'project_id,language' })
    } else {
      // Remove EN translation if not provided
      await supabase
        .from('project_translations')
        .delete()
        .eq('project_id', id)
        .eq('language', 'en')
    }

    // Update technologies if provided
    if (technology_ids !== undefined) {
      await supabase.from('project_technologies').delete().eq('project_id', id)
      
      if (technology_ids.length > 0) {
        const projectTechnologies = technology_ids.map((tech_id: number) => ({
          project_id: parseInt(id),
          technology_id: tech_id,
        }))
        await supabase.from('project_technologies').insert(projectTechnologies)
      }
    }

    // Update tags if provided
    if (tag_ids !== undefined) {
      await supabase.from('project_tags').delete().eq('project_id', id)
      
      if (tag_ids.length > 0) {
        const projectTags = tag_ids.map((tag_id: number) => ({
          project_id: parseInt(id),
          tag_id,
        }))
        await supabase.from('project_tags').insert(projectTags)
      }
    }

    return NextResponse.json({ data: project })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Translations are deleted automatically via CASCADE
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
