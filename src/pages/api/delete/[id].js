import { deleteFromCloudinary } from "@/lib/cloudinary";
import connectDb from "@/lib/connectDB";
import { runMiddleware } from "@/lib/runMiddleware";
import { Job } from "@/models/job.model";
import { logActivity } from "@/lib/logActivity";
import { authenticateUserPages } from "@/middlewares/authenticateUser";
import { verifyJwtMiddlewarePages } from "@/middlewares/verifyjwtpages";

export const config = { api: { bodyParser: false } };


export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    try {

        await connectDb();

        await runMiddleware(req, res, verifyJwtMiddlewarePages);
        await runMiddleware(req, res, authenticateUserPages)

        const userId = req.user?.id;
        const jobId = req.query.id;
        console.log(`job id is $${jobId}`)
        console.log(`user id is $${userId}`)
        //verify only owner can delete job 

       // console.log("✅ Step 3: Fetching job from DB");

        const jobDoc = await Job.findOne({ _id: jobId, user: userId });

        if (!jobDoc) {
            return res.status(403).json({ error: "unAuthorized access to this job" })
        }

        const hasResume = jobDoc.resumeFile;
        if (hasResume) {
            try {
                const urlParts = jobDoc.resumeFile.split("/");
                const fileName = urlParts[urlParts.length - 1];
                const publicId = fileName.split(".")[0];

                await deleteFromCloudinary(publicId);
            } catch (error) {
                console.error("cannot delete pdf resume from cloudinary")
                return res.status(500).json({ error: "Internal Server error" })
            }
        }
        const jobTitle = jobDoc.jobTitle;
        const companyName = jobDoc.companyName

        const response = await Job.findByIdAndDelete(jobId)

        if (!response) {
            return res.status(500).json({ error: "cannot delete job from db" })
        }

        await logActivity(userId, `Deleted job: ${jobTitle} at ${companyName}`)

        return res.status(200).json({ message: "job is successfully deleted " })

    } catch (error) {
        console.error("delete job error:", error);
        return res.status(500).json({ error: error.message });
    }
}