import { User } from "@/models/user.model";
import connectDb from "@/lib/connectDB";

export async function POST(req) {
    try {
        await connectDb();

        const { username, email, password, fullName } = await req.json();

        if (!username || !email || !password) {
            return Response.json({ error: "Missing field" }, { status: 400 });
        }

        const exsisting = await User.findOne({ username });
        if (exsisting) {
            return Response.json({ error: "user already exists" }, { status: 409 });
        }

      // const hashedpassword = await hash(password, 10);
        const user = await User.create({
            fullName: fullName || "",
            username,
            email,
            password
        });

        const UserData = {
            userId: user._id,
            email: user.email,
            username: user.username
        };

        return Response.json({
            message: "User successfully registered",
            status: 200,
            user: UserData,
        });

    } catch (error) {
        console.error("Registration error:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
