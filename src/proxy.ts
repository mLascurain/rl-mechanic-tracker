import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          const previousCookies = supabaseResponse.cookies.getAll()
          const previousHeaders = new Headers(supabaseResponse.headers)
          supabaseResponse = NextResponse.next({ request })
          previousCookies.forEach((cookie) => supabaseResponse.cookies.set(cookie))
          previousHeaders.forEach((value, name) => {
            if (name.toLowerCase() !== 'set-cookie') supabaseResponse.headers.set(name, value)
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([name, value]) => supabaseResponse.headers.set(name, value))
        },
      },
    }
  )

  // Refresh session so it doesn't expire mid-visit
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect authenticated routes
  const protectedPaths = ['/profile', '/progress', '/recommendations']
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`)
  )

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.search = ''
    url.searchParams.set('redirectTo', `${request.nextUrl.pathname}${request.nextUrl.search}`)
    const response = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie))
    response.headers.set('Cache-Control', 'private, no-store')
    return response
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|mp4|webm|woff|woff2)$).*)',
  ],
}
