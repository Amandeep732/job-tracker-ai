import connectDb from "@/lib/connectDB";
import { Job } from "@/models/job.model";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const userId = request.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json(
                { error: "userId is missing" },
                { status: 404 }
            );
        }

        await connectDb();

        const jobDocs = await Job.find({ user: userId })
            .sort({ createdAt: -1 })
            .select("-createdAt -updatedAt -__v -user");

        if (!jobDocs || jobDocs.length === 0) {
            return NextResponse.json(
                { message: "User has no existing jobs" },
                { status: 200 }
            );
        }
        console.log(`all jobs is ${jobDocs}`)

        return NextResponse.json(jobDocs, { status: 200 });

    } catch (error) {
        console.error("Something went wrong while getting user job docs:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
