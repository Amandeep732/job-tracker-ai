import { User } from "@/models/user.model";
import jwt from "jsonwebtoken";
import { generateAccessandRefreshToken } from "@/lib/generateTokens";
import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDB";

export async function POST(request) {
    await connectDb();

    const body = await request.json();
    const incomingToken = body.refreshToken;

    console.log("🟡 Received refresh token:", incomingToken);

    if (!incomingToken) {
        return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
    }

    try {
        // ✅ Verify JWT
        const decodedToken = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET);
        console.log(`decoded tokes is :${decodedToken}`);
        
        // ✅ Find user by decoded ID
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            return NextResponse.json({ error: "Invalid user token" }, { status: 401 });
        }

        if (user.refreshToken !== incomingToken) {
            return NextResponse.json({ error: "Token is expired or already used" }, { status: 401 });
        }

        // ✅ Generate new tokens
        const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);

        // ✅ Set new tokens in cookies
        const response = NextResponse.json(
            {
                message: "Token refreshed successfully",
                accessToken,
                refreshToken
            },
            { status: 200 }
        );

        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 15, // 15 minutes
            path: "/"
        });

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/"
        });

        return response;

    } catch (error) {
        console.error("🔴 Access Token Refresh Error:", error.message);
        return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 500 });
    }
}
