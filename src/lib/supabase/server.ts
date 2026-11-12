import { createServerClient } from '@supabase/ssr'
import { cache } from 'react'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

/**
 * Server Component / Server Action client.
 * Shares a client within a Server Component request, never across users.
 * `cookies()` is async — await it inside the request-scoped factory.
 */
export const createClient = cache(async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Components cannot set cookies — proxy handles refreshes.
          }
        },
      },
    }
  )
})

/** Deduplicate verified Auth lookups within one render, without persistent caching. */
export const getUser = cache(async function getUser() {
  const supabase = await createClient()
  return supabase.auth.getUser()
})
