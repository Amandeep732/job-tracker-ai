import { User } from "@/models/user.model";
import connectDb from "@/lib/connectDB";
import { generateAccessandRefreshToken } from "@/lib/generateTokens";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    const { username, email, password } = await req.json();

    if (!username && !email) {
      return NextResponse.json(
        { error: "Please provide username or email" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 404 });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
    });

    // ✅ Set accessToken cookie
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    // ✅ Set refreshToken cookie
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
