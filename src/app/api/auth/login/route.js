import { User } from "@/models/user.model";
import connectDb from "@/lib/connectDB";
import { generateAccessandRefreshToken } from "@/lib/generateTokens";
import { cookies } from "next/headers";



export async function POST(req) {
    
    await connectDb();
    const { username, email, password } = await req.json();

    if (!username && !email) {
        return Response.json({ status: 400 }, { error: "please provide at least one username or email" })
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        return Response.json({ status: 404 }, { error: "user does not exsist" })
    }

    // now we have user 
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        return Response.json({ status: 400 }, { error: "password is incorrect" })
    }


    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);

    // set accesstoken in cookie is important 
    cookies().set("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 15, // 15 minutes
        path: "/",
    })

    return Response.json({
        message: "login successfully",
        user: {
            _id: user._id,
            email: user.email,
            username: user.username,
        },
        accessToken,
        refreshToken
    },  { status: 200 })

}