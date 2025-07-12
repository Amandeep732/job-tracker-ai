import { NextResponse } from 'next/server'
import { verifyJwtMiddleware } from './middlewares/auth.middleware'

const PROTECTED_PATHS = [
  "/api/auth/logout",
  "/api/jobs", // ✅ with leading slash
  "/api/user/me",
  "/api/user/stats",
  "/api/user/activity",
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
    "/api/jobs/:path*",
    "/api/user/me",
    "/api/user/stats",
    "/api/user/activity",
  ],
};
