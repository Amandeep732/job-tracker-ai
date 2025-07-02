import { User } from "@/models/user.model";
import connectDb from "@/lib/connectDB";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDb();
    
        const userId = request.headers.get('x-user-id');
        if (!userId) {
            return NextResponse({ status: 404 }, { error: "User id not found" });
        }

        await User.findByIdAndUpdate( 
            userId,
            {
                refreshToken: null
            },
            {
                new: true
            }
        );

        const response = NextResponse.json({ success: true, message: "User logged out" },
            { status: 200 });
    
        response.cookies.set("refreshToken", "", {
            httpOnly: true,
            secure: true,
            expires: new Date(0), // Expire immediately
        });
    
        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
