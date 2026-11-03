import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // IMPORTANT: getUser() çağrısı hem session'ı doğrular hem de süresi dolmuşsa yeniler
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Giriş yapmamış kullanıcıyı korumalı sayfalardan /login sayfasına yönlendir
  if (!user && !pathname.startsWith('/login') && !pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Giriş yapmış kullanıcı /login sayfasına veya ana sayfaya giderse /drive'a yönlendir
  if (user && (pathname === '/login' || pathname === '/')) {
    const url = request.nextUrl.clone()
    url.pathname = '/drive'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
