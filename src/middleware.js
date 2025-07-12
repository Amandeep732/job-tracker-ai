import { NextResponse } from 'next/server'
import { verifyJwtMiddleware } from './middlewares/auth.middleware'

const PROTECTED_PATHS = [
  "/auth/logout",
  "/jobs", // ✅ with leading slash
  "/user/me",
  "/user/stats",
  "/user/activity",
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
    "/auth/logout",
    "/jobs/:path*",
    "/user/me",
    "/user/stats",
    "/user/activity",
  ],
};
