import { NextResponse } from 'next/server'
import { jwtVerify } from "jose";

const key = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

export async function middleware(request) {
  console.log(`Middleware running for: ${request.nextUrl.pathname}`);

  try {
    // Extract token from cookies or Authorization header
    const token = 
      request.cookies.get("accessToken")?.value ||
      request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("❌ No token found");
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify JWT
    const { payload } = await jwtVerify(token, key);
    if (!payload?.id) {
      console.log("⚠️ Invalid token payload");
      return new NextResponse(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create response and set user ID cookie
    const response = NextResponse.next();
    response.cookies.set({
      name: "userId",
      value: payload.id,
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
      // Remove domain or set dynamically
      domain: process.env.NODE_ENV === "production" 
        ? "job-tracker-nine-henna.vercel.app"  // 👈 Change to your actual domain
        : undefined
    });

    console.log(`✅ User ID cookie set for: ${payload.id}`);
    return response;
    
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    return new NextResponse(
      JSON.stringify({ error: "Invalid token" }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export const config = {
  matcher: [
    "/api/auth/logout",
    "/api/jobs/:path*",
    "/api/user/me",
    "/api/user/stats",
    "/api/user/activity",
  ],
};

export const runtime = edge;


