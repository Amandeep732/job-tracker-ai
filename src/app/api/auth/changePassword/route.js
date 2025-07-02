import { User } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { newPassword, oldPassword } = await request.json();

        if (!newPassword || !oldPassword) {
            return NextResponse.json({ error: "Password field is empty" }, { status: 400 });
        }

        const userId = request.headers.get("x-user-id");
        const auth = request.headers.get("authorization"); // fixed this line

        console.log(`data from header id is: ${userId} and auth is: ${auth}`);

        if (!userId) {
            return NextResponse.json({ error: "User ID missing from headers" }, { status: 401 });
        }

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if (!isPasswordCorrect) {
            return NextResponse.json({ error: "Invalid old password" }, { status: 400 });
        }

        user.password = newPassword; // corrected from `password` to `newPassword`
        await user.save({ validateBeforeSave: false }); // fixed from `User.save(...)` to `user.save(...)`

        return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });

    } catch (error) {
        console.error("Something went wrong during password changing:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
