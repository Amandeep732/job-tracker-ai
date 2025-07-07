import connectDb from "@/lib/connectDB";
import { redis } from "@/lib/redis";
import { User } from "@/models/user.model";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  await connectDb();
  const { email } = await req.json();

  const normalizedEmail = email.trim().toLowerCase(); // ✅ important!

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return NextResponse.json({ message: "Email not found" }, { status: 404 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("Generated OTP for", normalizedEmail, "is:", otp);

  await redis.set(`otp:${normalizedEmail}`, otp, { ex: 300 }); // ✅ 5 min expiry

  try {
    await resend.emails.send({
      from: "Job Tracker <onboarding@resend.dev>",
      to: [normalizedEmail],
      subject: "Your One-Time Password (OTP) for Job Tracker",
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f7;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">🔐 Job Tracker - Password Reset OTP</h2>
        <p style="font-size: 16px; color: #555;">
          Hello 👋,
        </p>
        <p style="font-size: 16px; color: #555;">
          We received a request to reset your password. Please use the OTP below to proceed:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 24px; font-weight: bold; color: #2d3748; letter-spacing: 4px;">
            ${otp}
          </p>
        </div>

        <p style="font-size: 14px; color: #777;">
          This OTP is valid for the next <strong>10 minutes</strong>. Please do not share it with anyone.
        </p>

        <p style="font-size: 14px; color: #999; margin-top: 30px;">
          If you didn't request this, you can safely ignore this email.
        </p>

        <p style="font-size: 14px; color: #999;">
          Stay secure,<br />
          <strong>Job Tracker Team</strong>
        </p>
      </div>
    </div>
  `,
    });

    return NextResponse.json({
      message: `OTP sent successfully to ${normalizedEmail}`,
    });
  } catch (error) {
    console.error("Email sending failed", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
