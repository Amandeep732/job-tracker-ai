import connectDb from "@/lib/connectDB";

import { User } from "@/models/user.model";

export async function GET(request) {
  try {
    //console.log("🔍 /api/user/me hit");

    await connectDb();
    // jwt verify middleware run behind the scene and put user id in header
    const userId = request.cookies.get("userId")?.value;
    console.log(`userid from me  ${userId}`)
    if (!userId) {
      return new Response(
        JSON.stringify({ message: "user id not found" }),
        { status: 404 }
      );
    }

    const user = await User.findById(userId);
    console.log(`user is in me route ${user}`)
    if (!user) {
      return new Response(
        JSON.stringify({ message: "user not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ id: user._id, username: user.username }),
      { status: 200 }
    );

  } catch (error) {
    console.error("User fetch error:", error);
    return new Response(
      JSON.stringify({ error: "User not authenticated" }),
      { status: 401 }
    );
  }
}

