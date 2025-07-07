import connectDb from "@/lib/connectDB";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase(); // ✅ match Redis key
    const storedOtp = await redis.get(`otp:${normalizedEmail}`);

    console.log("Stored OTP:", storedOtp, "Entered OTP:", otp); // ✅ add logging

    if (String(storedOtp) !== String(otp)) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 401 }
      );
    }

    await redis.del(`otp:${normalizedEmail}`);
    await redis.set(`otp_verified:${normalizedEmail}`, "true", { ex: 60 });

    const res = NextResponse.json({ message: true }, { status: 200 });
    res.cookies.set("reset-email", normalizedEmail, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15,
    });

    return res;
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
