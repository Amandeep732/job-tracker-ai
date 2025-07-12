import connectDb from "@/lib/connectDB";
import { Activity } from "@/models/activity.model";

export async function GET(request) {
  try {
    await connectDb();
   
    const userId = request.cookies.get("userId")?.value;

    // User ID from header set by JWT middleware
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID not found" }),
        { status: 400 }
      );
    }

    const getAllActivity = await Activity.find({ userId }).sort({ createdAt: -1 });

    if (!getAllActivity.length) {
      return new Response(
        JSON.stringify({ message: "No recent activity." }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Successfully fetched activity",
        activities: getAllActivity,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Activity fetch error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}

