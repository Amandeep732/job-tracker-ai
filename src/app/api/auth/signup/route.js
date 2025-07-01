import { User } from "@/models/user.model";
import { hash } from "bcryptjs"
import connectDb from "@/lib/connectDB";


export async function POST(req) {
    await connectDb()

    const { username, email, password, fullName } = await req.json();

    if (!username || !email || !password) {
        return Response.json({ error: "Missing field" }, { status: 400 })
    }

    const exsisting = await User.findOne({ username })
    if (exsisting) {
        return Response.json({ error: "user is already exsist" }, { status: 409 })
    }
    // 🥹 create user
    const hashedpassword = await hash(password, 10)
    const user = await User.create({
            fullName : fullName || "",
            username,
            email,
            password: hashedpassword
        })

    // Remove sensitive fields from response
    const UserData = {
        userId: user._id,
        email: user.email,
        username: user.username
    }


    return Response.json({
        message: "User successfully registerd",
        status: 200,
        user: UserData,
    })
}