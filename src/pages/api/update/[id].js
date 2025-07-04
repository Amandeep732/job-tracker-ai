import { deleteFromCloudinary, uploadOnCloudinary } from "@/lib/cloudinary";
import connectDb from "@/lib/connectDB";
import { upload } from "@/lib/multer";
import { runMiddleware } from "@/lib/runMiddleware";
import { authenticateUserPages } from "@/pages/middlewares/authenticateUser";
import { Job } from "@/models/job.model";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
    if (req.method !== "PATCH") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        await connectDb();
        await runMiddleware(req, res, authenticateUserPages);
        const userId = req.user?.id;
        await runMiddleware(req, res, upload.single("resumeFile"));
        const jobId = req.query.id;

        const exsisting = await Job.findOne({ _id: jobId, user: userId });
        if (!exsisting) {
            return res.status(403).json({ error: "Unauthorized access to this job" });
        }

        const {
            jobTitle,
            companyName,
            jobLocation,
            jobDesc,
            notes,
            reminderDate,
            status,
            AiSummary,
            AiTips,
            AiMatchScore
        } = req.body;

        const resumeFile = req.file;

        // ✅ Check if user is updating with same data (resumeFile not changed)
        const isSameData =
            jobTitle === exsisting.jobTitle &&
            companyName === exsisting.companyName &&
            jobLocation === exsisting.jobLocation &&
            jobDesc === exsisting.jobDesc &&
            notes === exsisting.notes &&
            reminderDate === exsisting.reminderDate &&
            status === exsisting.status &&
            AiSummary === exsisting.AiSummary &&
            AiTips === exsisting.AiTips &&
            AiMatchScore === exsisting.AiMatchScore &&
            !resumeFile;

        if (isSameData) {
            return res.status(400).json({ error: "Data is already up-to-date ❌" });
        }

        let isResumeUpdated = false;
        let uploaded;

        if (resumeFile) {
            if (resumeFile.mimetype !== "application/pdf") {
                return res.status(400).json({ error: "Only PDF files are allowed" });
            }
            try {
                uploaded = await uploadOnCloudinary(resumeFile?.path);
                if (!uploaded?.url) {
                    return res.status(500).json({ error: "File not uploaded to Cloudinary" });
                }

                isResumeUpdated = true;

                // delete the older file in cloudinary
                if (!exsisting.resumeFile) {
                    return res.status(500).json({ error: "Cannot get older resume for deleting" });
                }
                const urlParts = exsisting.resumeFile.split("/");
                const fileName = urlParts[urlParts.length - 1];
                const publicId = fileName.split(".")[0];

                const ans = await deleteFromCloudinary(publicId);
                console.log("Deleted old file from Cloudinary:", ans);
            } catch (error) {
                console.error("Error during resume upload/delete:", error);
                return res.status(500).json({ error: "Internal server error" });
            }
        }

        const updateFields = {
            jobTitle,
            companyName,
            jobLocation,
            jobDesc,
            notes,
            reminderDate,
            status,
            AiSummary,
            AiTips,
            AiMatchScore,
        };

        if (isResumeUpdated && resumeFile) {
            updateFields.resumeFile = uploaded.url;
        }

        await Job.findByIdAndUpdate(jobId, {
            $set: updateFields,
        }, { new: true });

        return res.status(200).json({
            message: "Job updated successfully ✅",
            updatedFields: updateFields,
        });

    } catch (err) {
        console.error("update job error:", err);
        return res.status(500).json({ error: err.message });
    }
}
