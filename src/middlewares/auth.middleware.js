import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function verifyJwtMiddleware(request) {
    try {
        console.log("logout middleware is running");
        
        const token = request.cookies.get("accessToken")?.value ||
            request.headers.get("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url))
        }

        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        console.log(decodedToken);

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", decodedToken._id);


        return NextResponse.next({
            request: {
                headers: requestHeaders
            }
        })
    } catch (error) {
        return new NextResponse("unAuthorized", { status: 401 })
    }
}