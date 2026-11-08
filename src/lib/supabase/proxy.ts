import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )

          supabaseResponse = NextResponse.next({
            request,
          })

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )

          Object.entries(headers ?? {}).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  // Refresh and verify the user's session
  await supabase.auth.getClaims()

  // -------------------------------------------------------------------------
  // STEP A — ROUTING: /dashboard requires a signed-in user
  // (commented out — learning baseline; you will write this yourself)
  // -------------------------------------------------------------------------
  // Reference implementation. To restore, remove the block-comment markers.
  /*
  const { data } = await supabase.auth.getClaims()
  const userId = data?.claims?.sub

  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard') && !userId) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/signin'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }
  */

  // -------------------------------------------------------------------------
  // STEP B — ROLE CHECK (commented out — later exercise)
  // -------------------------------------------------------------------------
  /*
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (pathname.startsWith('/dashboard') && profile?.role !== 'admin') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.search = ''
    return redirectWithCookies(url, supabaseResponse)
  }
  */

  return supabaseResponse
}

// ---------------------------------------------------------------------------
// STEP B (helper) — preserve refreshed session cookies on a redirect.
// ---------------------------------------------------------------------------
/*
function redirectWithCookies(url: URL, base: NextResponse) {
  const redirect = NextResponse.redirect(url)
  base.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
  return redirect
}
*/
