import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { safeRedirectPath } from '@/lib/supabase/validation'

/**
 * GET /auth/callback
 *
 * Supabase redirects here after OAuth (Google) or magic-link sign-in.
 * Exchanges the one-time `code` for a session and sets the cookie.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = safeRedirectPath(searchParams.get('next'), '/')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const response = NextResponse.redirect(new URL(next, origin))
      response.headers.set('Cache-Control', 'private, no-store')
      return response
    }
  }

  // If something went wrong, redirect to an error page or login
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`)
}
