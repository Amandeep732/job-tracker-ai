import { deleteFromCloudinary } from "@/lib/cloudinary";
import connectDb from "@/lib/connectDB";
import { runMiddleware } from "@/lib/runMiddleware";
import { verifyJwtMiddlewarePages } from "@/pages/middlewares/verifyjwtpages";
import { authenticateUserPages } from "@/pages/middlewares/authenticateUser";
import { Job } from "@/models/job.model";

export const config = { api: { bodyParser: false } };


export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    try {
        console.log("✅ Step 1: Connecting DB");
        await connectDb();
        console.log("✅ Step 2: Running middleware");
         await runMiddleware(req, res, verifyJwtMiddlewarePages);
        console.log("✅ Step 3: Running middleware 2"); // to verify user is login or not
        await runMiddleware(req, res, authenticateUserPages) // push user in req

        const userId = req.user?.id;
        const jobId = req.query.id;

        //verify only owner can delete job 

        console.log("✅ Step 3: Fetching job from DB");

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

        const response = await Job.findByIdAndDelete(jobId)

        if (!response) {
            return res.status(500).json({ error: "cannot delete job from db" })
        }

        return res.status(200).json({ message: "job is successfully deleted " })

    } catch (error) {
        console.error("delete job error:", err);
        return res.status(500).json({ error: err.message });
    }
}