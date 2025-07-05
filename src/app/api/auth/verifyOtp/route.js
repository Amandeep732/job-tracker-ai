import { redis } from "@/lib/redis";
import { HTTP_METHODS } from "next/dist/server/web/http";
import { cookies } from "next/headers";

export async function POST(req) {
  const { email, otp } = await req.json();

  const storedOtp = await redis.get(`otp:${email}`); // Redis used here

  if (storedOtp === otp) {
    await redis.del(`otp:${email}`); // Clear it after use
    await redis.set(`otp_verified:${email}`, true, { ex: 600 }); // valid for 10 min

    cookies().set("reset-email", email, {   // set cookie to get after 
      httpOnly: true,
      maxage: 16,
      path: "/",
      secure: true,
      sameSite: "Strict",
    })
    return Response.json({ success: true });
  } else {
    return Response.json({ error: "Invalid OTP" });
  }
}
