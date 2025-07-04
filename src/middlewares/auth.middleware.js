import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const key = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

export async function verifyJwtMiddleware(request) {
    try {
        //console.log("logout middleware is running");

        const token = request.cookies.get("accessToken")?.value ||
            request.headers.get("Authorization")?.replace("Bearer ", "");
        //console.log("Token received:", token);

        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url))
        }

        const { payload } = await jwtVerify(token, key);
        if (!payload) {
            return NextResponse.json({ error: "token not decoded" }, { status: 500 })
        }
        //console.log("Token received:", payload);

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", payload.id);


        return NextResponse.next({
            request: {
                headers: requestHeaders
            }
        })
    } catch (error) {
        console.error("❌ Token verification failed:", error.message);
        return new NextResponse("Unauthorized token", { status: 401 });
    }
}