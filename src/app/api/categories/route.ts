import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/categories
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang') || 'pt-BR'
    const include_translations = searchParams.get('include_translations') === 'true'

    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        translations:category_translations(*)
      `)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const categories = data?.map((category) => {
      const translations = category.translations || []
      const ptTranslation = translations.find((t: any) => t.language === 'pt-BR')
      const enTranslation = translations.find((t: any) => t.language === 'en')
      const currentTranslation = lang === 'en' ? (enTranslation || ptTranslation) : ptTranslation

      if (include_translations) {
        return {
          ...category,
          translations: {
            pt: ptTranslation || null,
            en: enTranslation || null,
          },
        }
      } else {
        return {
          ...category,
          name: currentTranslation?.name || category.name,
          description: currentTranslation?.description || category.description,
        }
      }
    })

    return NextResponse.json({ data: categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/categories
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { translations, ...categoryData } = body

    // Validate required fields
    if (!translations?.pt?.name || !categoryData.slug) {
      return NextResponse.json({ error: 'Nome (PT-BR) e slug são obrigatórios' }, { status: 400 })
    }

    // Create the category with PT name
    const { data, error } = await supabase
      .from('categories')
      .insert({
        ...categoryData,
        name: translations.pt.name,
        description: translations.pt.description,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Add PT-BR translation
    await supabase.from('category_translations').insert({
      category_id: data.id,
      language: 'pt-BR',
      name: translations.pt.name,
      description: translations.pt.description || null,
    })

    // Add EN translation if provided
    if (translations.en?.name) {
      await supabase.from('category_translations').insert({
        category_id: data.id,
        language: 'en',
        name: translations.en.name,
        description: translations.en.description || null,
      })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
