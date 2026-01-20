import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { TagTranslation } from '@/lib/types/database'

// GET /api/tags/[id]
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
      .from('tags')
      .select(`
        *,
        translations:tag_translations(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const translations = (data.translations || []) as TagTranslation[]
    const ptTranslation = translations.find((t) => t.language === 'pt-BR')
    const enTranslation = translations.find((t) => t.language === 'en')
    const currentTranslation = lang === 'en' ? (enTranslation || ptTranslation) : ptTranslation

    if (include_translations) {
      return NextResponse.json({
        data: {
          ...data,
          translations: {
            pt: ptTranslation || null,
            en: enTranslation || null,
          },
        },
      })
    } else {
      return NextResponse.json({
        data: {
          ...data,
          name: currentTranslation?.name || data.name,
        },
      })
    }
  } catch (error) {
    console.error('Error fetching tag:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/tags/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { translations, ...tagData } = body

    // Validate required fields
    if (!translations?.pt?.name) {
      return NextResponse.json({ error: 'Nome (PT-BR) é obrigatório' }, { status: 400 })
    }

    // Update the tag with PT name
    const { data, error } = await supabase
      .from('tags')
      .update({
        ...tagData,
        name: translations.pt.name,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update PT-BR translation (upsert)
    await supabase.from('tag_translations').upsert({
      tag_id: parseInt(id),
      language: 'pt-BR',
      name: translations.pt.name,
    }, { onConflict: 'tag_id,language' })

    // Handle EN translation
    if (translations.en?.name) {
      await supabase.from('tag_translations').upsert({
        tag_id: parseInt(id),
        language: 'en',
        name: translations.en.name,
      }, { onConflict: 'tag_id,language' })
    } else {
      await supabase
        .from('tag_translations')
        .delete()
        .eq('tag_id', id)
        .eq('language', 'en')
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/tags/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Translations are deleted automatically via CASCADE
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
