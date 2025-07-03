import { User } from "@/models/user.model";
import connectDb from "@/lib/connectDB";
import { generateAccessandRefreshToken } from "@/lib/generateTokens";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        await connectDb();
        const { username, email, password } = await req.json();
    
        if (!username && !email) {
            return Response.json(
                { error: "please provide at least one username or email" },
                { status: 400 }
            );
        }
    
        const user = await User.findOne({
            $or: [{ email }, { username }]
        });
    
        if (!user) {
            return Response.json({ error: "user does not exist" }, { status: 404 });
        }
    
        const isPasswordValid = await user.isPasswordCorrect(password);
    
        if (!isPasswordValid) {
            return Response.json({ error: "Invalid credentials" }, { status: 400 });
        }
    
        const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);
    
        await cookies().set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 15,
            path: "/",
        });
    
        return Response.json({
            message: "login successfully",
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
            },
            accessToken,
            refreshToken
        }, { status: 200 });
    } catch (error) {
        console.error("Login error:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
