import { upload } from '@/lib/multer';
import { uploadOnCloudinary } from '@/lib/cloudinary';
import { Job } from '@/models/job.model';
import connectDb from '@/lib/connectDB';
import { runMiddleware } from '@/lib/runMiddleware';
import { logActivity } from '@/lib/logActivity';
import { authenticateUserPages } from '@/middlewares/authenticateUser';
// ✅ AI imports for langchain

// import { getEmbedding } from "@/lib/getEmbedding";
// import { cosineSimilarity } from "@/lib/cosineSimilarity";
// import { generateSummary, generateTips } from "@/lib/langchain/aiHelpers";
// import pdfParse from "pdf-parse";
// import fs from "fs";



export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDb();

    // ✅ First: Authenticate user
    await runMiddleware(req, res, authenticateUserPages);

    // ✅ Second: Upload file
    await runMiddleware(req, res, upload.single("resumeFile"));

    const {
      jobTitle,
      companyName,
      jobDesc,
      jobLocation,
      notes,
      reminderDate,
      status,
      AiSummary = '', // Default empty string
      AiTips = '[]', // Default empty array (as string)
      AiMatchScore = '' // Default null
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
    console.log(`resume path is ${req}`)
    if (!pathName) return res.status(400).json({ error: "Resume is missing" });

    // ✅ ✅ ✅ AI LOGIC STARTS HERE
    // let resumeText = '';
    // try {
    //   const buffer = fs.readFileSync(pathName);
    //   const pdfData = await pdfParse(buffer);
    //   resumeText = pdfData.text;
    //   // fs.unlinkSync(pathName);
    // } catch (error) {
    //   console.error("PDF parse error:", error);
    //   return res.status(500).json({ error: "Failed to read resume file" });
    // }



    const resume = await uploadOnCloudinary(pathName);
    if (!resume.url) return res.status(500).json({ error: "Cloudinary upload failed" });

    // Generate embeddings & AI insights
    // let summary = "";
    // let tips = [];
    // let matchScore = 0;

    // try {
    //   const [resumeEmb, jobEmb] = await Promise.all([
    //     getEmbedding(resumeText),
    //     getEmbedding(jobDesc)
    //   ]);

    //   matchScore = cosineSimilarity(resumeEmb, jobEmb) * 100;
    //   summary = await generateSummary(jobDesc);
    //   tips = await generateTips(resumeText, jobDesc);
    // } catch (error) {
    //   console.error("AI generation error:", error);
    //   summary = "Summary not generated";
    //   tips = ["No AI tips available"];
    //   matchScore = 0;
    //   return res.status(500).json({ error: "Failed to generate AI insights" });
    // }

    // ✅ ✅ ✅ AI LOGIC ENDS HERE

    const parsedAiTips = typeof AiTips === 'string' ? JSON.parse(AiTips) : AiTips;

    const response = await Job.create({
      user: userId,
      jobTitle: jobTitle.toLowerCase().trim(),
      companyName: companyName.trim(),
      jobDesc: jobDesc.trim(),
      jobLocation,
      notes,
      reminderDate,
      status,
      resumeFile: resume.url,
      AiSummary,
      AiTips: Array.isArray(parsedAiTips) ? parsedAiTips : [],
      AiMatchScore:isNaN(Number(AiMatchScore)) ? null : Number(AiMatchScore)
    });

    if (!response) {
      return res.status(500).json({ error: "something went wrong during entry in job data in db " })
    }
    await logActivity(userId, `Applied to ${companyName} for ${jobTitle}`)

    return res.status(200).json({
      message: "Job added successfully",
      job: response
    });

  } catch (err) {
    console.error("AddJob Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
