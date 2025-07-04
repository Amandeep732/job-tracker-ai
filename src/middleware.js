import { NextResponse } from 'next/server'
import { verifyJwtMiddleware } from './middlewares/auth.middleware'

const PROTECTED_PATHS = [
  "/api/auth/logout", 
  "/api/auth/changePassword",
  "/api/jobs" // ✅ with leading slash
];

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // ✅ correct startsWith direction
  const isProtected = PROTECTED_PATHS.some((p) => path.startsWith(p));

  if (isProtected) {
    return verifyJwtMiddleware(request);
  }

  return NextResponse.next();
}

// ✅ Matcher for all relevant API routes
export const config = {
  matcher: [
    "/api/auth/logout",
    "/api/auth/changePassword",
    "/api/jobs/:path*", // ✅ includes /api/jobs/123 etc.
  ],
};
