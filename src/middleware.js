import { NextResponse } from 'next/server'

export async function middleware(request) {
  const path = request.nextUrl.pathname

  // Define public paths (no token required)
  const isPublicPath = [
    '/api/user/activity',
    '/api/user/stats',
    '/api/user/me',
    '/api/jobs/:path*'
  ].some(publicPath => {
    // Handle dynamic routes like '/api/jobs/:path*'
    if (publicPath.includes(':path*')) {
      return path.startsWith(publicPath.replace(':path*', ''))
    }
    return path === publicPath
  })

  const token = request.cookies.get('token')?.value || ''

  // Redirect if trying to access public path with token
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  // Redirect to login if trying to access protected path without token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // Continue to the requested page if all checks pass
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/api/auth/logout",
    "/api/jobs/:path*",
    "/api/user/me",
    "/api/user/stats",
    "/api/user/activity",
  ],
}