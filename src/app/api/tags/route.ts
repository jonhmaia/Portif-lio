import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/tags
export async function GET(request: NextRequest) {
  try {
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
      .order('name', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const tags = data?.map((tag) => {
      const translations = tag.translations || []
      const ptTranslation = translations.find((t: any) => t.language === 'pt-BR')
      const enTranslation = translations.find((t: any) => t.language === 'en')
      const currentTranslation = lang === 'en' ? (enTranslation || ptTranslation) : ptTranslation

      if (include_translations) {
        return {
          ...tag,
          translations: {
            pt: ptTranslation || null,
            en: enTranslation || null,
          },
        }
      } else {
        return {
          ...tag,
          name: currentTranslation?.name || tag.name,
        }
      }
    })

    return NextResponse.json({ data: tags })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/tags
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { translations, ...tagData } = body

    // Validate required fields
    if (!translations?.pt?.name || !tagData.slug) {
      return NextResponse.json({ error: 'Nome (PT-BR) e slug são obrigatórios' }, { status: 400 })
    }

    // Create the tag with PT name
    const { data, error } = await supabase
      .from('tags')
      .insert({
        ...tagData,
        name: translations.pt.name,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Add PT-BR translation
    await supabase.from('tag_translations').insert({
      tag_id: data.id,
      language: 'pt-BR',
      name: translations.pt.name,
    })

    // Add EN translation if provided
    if (translations.en?.name) {
      await supabase.from('tag_translations').insert({
        tag_id: data.id,
        language: 'en',
        name: translations.en.name,
      })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
