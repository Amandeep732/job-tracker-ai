import { NextResponse } from 'next/server'
import { jwtVerify } from "jose";

// const PROTECTED_PATHS = [
//   "/api/auth/logout",
//   "/api/jobs", // ✅ with leading slash
//   "/api/user/me",
//   "/api/user/stats",
//   "/api/user/activity",
// ];
const key = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

export async function middleware(request) {
  
    console.log(`Middleware running for: ${request.nextUrl.pathname}`);

    try {
    const token =
      request.cookies.get("accessToken")?.value ||
      request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { payload } = await jwtVerify(token, key);

    if (!payload) {
      return NextResponse.json(
        { error: "token not decoded" },
        { status: 500 }
      );
    }
    
    const cookieDomain ="job-tracker-nine-henna.vercel.app";

    // ✅ Set user ID in cookie instead of header
    const response = NextResponse.next();
    response.cookies.set("userId", payload.id || 'id', {
      httpOnly: true,
      path: "/",
      sameSite: "none", 
      secure: true,
      domain: cookieDomain 
    });

    return response;
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return new NextResponse("Unauthorized token", { status: 401 });
  }

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

