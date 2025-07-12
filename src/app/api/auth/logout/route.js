import { User } from "@/models/user.model";
import connectDb from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
    try {
        await connectDb();
    
        const userId = request.headers.get('x-middleware-request-user-id');
        if (!userId) {
            return NextResponse.json(
                { error: "User id not found" },
                { status: 404 }
            );
        }

        // Clear refreshToken from database
        await User.findByIdAndUpdate( 
            userId,
            { refreshToken: null },
            { new: true }
        );

        // Create response
        const response = NextResponse.json(
            { success: true, message: "User logged out" },
            { status: 200 }
        );
    
        // Clear both tokens from cookies
        response.cookies.set("accessToken", "", {
            httpOnly: true,
            secure: true,
            expires: new Date(0), // Expire immediately
        });

        response.cookies.set("refreshToken", "", {
            httpOnly: true,
            secure: true,
            expires: new Date(0), // Expire immediately
        });
    
        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}