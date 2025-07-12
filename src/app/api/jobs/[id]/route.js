import connectDb from "@/lib/connectDB";
import { Job } from "@/models/job.model";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    if (!params.id) {
        return NextResponse.json({ error: "job id is missing" }, { status: 404 })
    }
    try {
        await connectDb()
        const jobId = params.id;
        console.log(`doc id : ${jobId}`);
        
        const userId = request.headers.get("x-middleware-request-user-id");
        console.log(`user id is : ${userId}`);
        
        const jobDocs = await Job.findOne({ _id: jobId, user: userId })
            .select("-createdAt -updatedAt -__v -user");
        if (!jobDocs) {
            return NextResponse.json({ error: "job document is not found" }, { status: 404 })
        }
        return NextResponse.json(
            { message: "Successfully fetched job", data: jobDocs },
            { status: 200 }
        );
    } catch (error) {
        console.error("cannot get a this job :", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}