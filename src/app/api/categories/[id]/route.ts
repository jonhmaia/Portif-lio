import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { CategoryTranslation } from '@/lib/types/database'

// GET /api/categories/[id]
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
      .from('categories')
      .select(`
        *,
        translations:category_translations(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const translations = (data.translations || []) as CategoryTranslation[]
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
          description: currentTranslation?.description || data.description,
        },
      })
    }
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/categories/[id]
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
    const { translations, ...categoryData } = body

    // Validate required fields
    if (!translations?.pt?.name) {
      return NextResponse.json({ error: 'Nome (PT-BR) é obrigatório' }, { status: 400 })
    }

    // Update the category with PT name
    const { data, error } = await supabase
      .from('categories')
      .update({
        ...categoryData,
        name: translations.pt.name,
        description: translations.pt.description,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update PT-BR translation (upsert)
    await supabase.from('category_translations').upsert({
      category_id: parseInt(id),
      language: 'pt-BR',
      name: translations.pt.name,
      description: translations.pt.description || null,
    }, { onConflict: 'category_id,language' })

    // Handle EN translation
    if (translations.en?.name) {
      await supabase.from('category_translations').upsert({
        category_id: parseInt(id),
        language: 'en',
        name: translations.en.name,
        description: translations.en.description || null,
      }, { onConflict: 'category_id,language' })
    } else {
      await supabase
        .from('category_translations')
        .delete()
        .eq('category_id', id)
        .eq('language', 'en')
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/categories/[id]
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

    // Check if category is used by any article
    const { count } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id)

    if (count && count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category that is being used by articles' },
        { status: 400 }
      )
    }

    // Translations are deleted automatically via CASCADE
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
