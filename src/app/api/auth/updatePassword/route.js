import connectDb from "@/lib/connectDB";
import { User } from "@/models/user.model";
import { cookies } from "next/headers";

export async function PATCH(req) {
    try {
        await connectDb()
        const { password } = await req.json();
        if (!password) {
            return Response.json({ error: "Password is required" }, { status: 400 });
        }

        const email = cookies().get("reset-email")?.value;
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

        const updated = await User.findByIdAndUpdate(user._id, {
            $set: {
                password: password
            }
        })

        if (!updated) {
            return Response.json({ error: "password does't change" }, { status: 500 })
        }
        await redis.del(`otp_verified:${email}`);
        cookies().delete("reset-email")

        return Response.json({ message: "Password has been successfully updated" }, { status: 200 });

    } catch (error) {
        console.error("password not updated successfully", error)
        return Response.json({ error: "Internal password error" }, { status: 500 })
    }
}