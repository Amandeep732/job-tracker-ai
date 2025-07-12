import connectDb from "@/lib/connectDB";
import { Job } from "@/models/job.model";

export async function GET(request) {
  try {
    await connectDb();
    //console.log(`job is ${Job}`)

    const userId = request.cookies.get("userId")?.value;

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "user id not found" }),
        { status: 404 }
      );
    }

    const jobs = await Job.find({ user: userId });

    if (jobs?.length === 0) {
      return new Response(
        JSON.stringify({
          totalApps: 0,
          interviewsCount: 0,
          profileCompletion: 0,
        }),
        { status: 200 }
      );
    }

    const totalApps = jobs.length;
    const interviewsCount = jobs.filter((job) => job.status === "Interview").length;
    const profileCompletion = Math.ceil((Math.random() + 1) * 30); // dummy for now
    
    return new Response(
      JSON.stringify({ totalApps, interviewsCount, profileCompletion }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Stats API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch dashboard stats" }),
      { status: 500 }
    );
  }
}

