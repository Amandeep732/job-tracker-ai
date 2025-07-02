import { User } from "@/models/user.model";
import jwt from "jsonwebtoken";
import { generateAccessandRefreshToken } from "@/lib/generateTokens";
import { NextResponse } from "next/server";
export async function POST(request) {
    const incomingToken = request.cookies.refreshToken || request.body.refreshToken;

    if (!incomingToken) {
        return Response.json({ error: "unauthorized request" }, { status: 401 })
    }
    try {
        const decodedToken = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            return Response.json({ error: "invalid user token" }, { status: 401 })
        }

        if (user?.refreshToken !== incomingToken) {
            return Response.json({ error: "token is expired or used" }, { status: 401 })
        }

        const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id)

        const response = NextResponse.json(
            {
                message: "Token refreshed successfully",
                accessToken,
                refreshToken
            },
            { status: 200 }
        );

        // Set accessToken cookie
        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 15, // 15 minutes
            path: "/"
        });

        // Set refreshToken cookie
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/"
        });

        return response;
    } catch (error) {
        console.error("Access Token  Refresh Error :", error);
        return Response.json({ error: "Internal server error" }, { status: 500 })
    }
}