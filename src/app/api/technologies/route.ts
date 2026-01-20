import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { technologySchema } from '@/lib/validations/technology'

// GET /api/technologies - List all technologies
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category')
    const is_active = searchParams.get('is_active')

    let query = supabase
      .from('technologies')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }
    if (is_active !== null) {
      query = query.eq('is_active', is_active === 'true')
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching technologies:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/technologies - Create a new technology
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = technologySchema.parse(body)

    const { data, error } = await (supabase
      .from('technologies')
      .insert(validatedData as any)
      .select()
      .single() as any)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error }, { status: 400 })
    }
    console.error('Error creating technology:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
