import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/database'

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.'
    )
  }

  return { url, key }
}

export function createClient() {
  const { url, key } = getSupabaseEnv()
  return createBrowserClient<Database>(url, key)
}
