// Add this temporary code at the TOP of middleware.js/ts
export const config = { matcher: '/:path*' } // Catch-all route for testing
export default async function middleware() {
  console.log('🔥 MIDDLEWARE FIRED AT:', new Date().toISOString())
  return NextResponse.next()
}