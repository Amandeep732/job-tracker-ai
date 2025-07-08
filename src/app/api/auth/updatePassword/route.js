import connectDb from "@/lib/connectDB";
import { redis } from "@/lib/redis";
import { User } from "@/models/user.model";
import { cookies } from "next/headers";

export async function PATCH(req) {
    try {
        await connectDb()
        const cookiesData = await cookies();
        const { password } = await req.json();
        if (!password) {
            return Response.json({ error: "Password is required" }, { status: 400 });
        }
        
        const email =  cookiesData.get("reset-email")?.value;
        console.log(`email from cookies ${email}`);
        // console.log(`email from cookies ${cookiesData.get("reset-email")}`);
        
        if (!email) {
            return Response.json({ error: "Email not found or OTP not verified" }, { status: 403 });
        }

        const verified = await redis.get(`otp_verified:${email}`);
        if (!verified) {
            return Response.json({ error: "OTP expired or not verified" }, { status: 403 });
        }


        const user = await User.findOne({ email });
        if (!user) {
            return Response.json({ error: "User does not exist" }, { status: 404 });
        }

        user.password = password;
        await user.save({ validateBeforeSave: false })

        await redis.del(`otp_verified:${email}`);
        cookiesData.delete("reset-email")

        return Response.json({ message: "Password has been successfully updated" }, { status: 200 });

    } catch (error) {
        console.error("password not updated successfully", error)
        return Response.json({ error: "Internal password error" }, { status: 500 })
    }
}