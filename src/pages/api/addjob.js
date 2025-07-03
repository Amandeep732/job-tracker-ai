import { upload } from '@/lib/multer';
import { uploadOnCloudinary } from '@/lib/cloudinary';
import { Job } from '@/models/job.model';
import connectDb from '@/lib/connectDB';
import { authenticateUser } from '@/middlewares/authenticateUser.middleware';
import { runMiddleware } from '@/lib/runMiddleware';


export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDb();

    // ✅ First: Authenticate user
    await runMiddleware(req, res, authenticateUser);

    // ✅ Second: Upload file
    await runMiddleware(req, res, upload.single("resumeFile"));

    const {
      jobTitle,
      jobLocation,
      notes,
      companyName,
      jobDesc,
      reminderDate,
      status,
      AiSummary,
      AiTips,
      AiMatchScore
    } = req.body;

    const userId = req.user?.id; // ✅ Got from token
    
    
    // ✅ Check for duplicate
    const existingJob = await Job.findOne({
      user: userId,
      jobTitle: jobTitle?.toLowerCase().trim(),
      companyName: companyName?.trim()
    });

    if (existingJob) {
      return res.status(409).json({ error: "This job already exists." });
    }

    const pathName = req.file?.path;
    if (!pathName) return res.status(400).json({ error: "Resume is missing" });

    const resume = await uploadOnCloudinary(pathName);
    if (!resume.url) return res.status(500).json({ error: "Cloudinary upload failed" });

    const response = await Job.create({
      user: userId,
      jobTitle: jobTitle.toLowerCase().trim(),
      jobLocation,
      notes,
      companyName: companyName.trim(),
      jobDesc: jobDesc.trim(),
      reminderDate,
      status,
      resumeFile: resume.url,
      AiSummary: AiSummary || '',
      AiTips: Array.isArray(AiTips) ? AiTips : [],
      AiMatchScore: isNaN(Number(AiMatchScore)) ? null : Number(AiMatchScore),
    });

    if(!response){
      return res.status(500).json({error : "something went wrong during entry in job data in db "})
    }

    return res.status(200).json({ message: "Job added successfully" });

  } catch (err) {
    console.error("AddJob Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
