import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParse from "pdf-parse";
import fs from "fs";
import { runMiddleware } from "@/lib/runMiddleware";
import { upload } from "@/lib/multer";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Free tier rate limiting (60 requests per minute)
const RATE_LIMIT = 60;
let requestCount = 0;
let lastResetTime = Date.now();

export default async function handler(req, res) {
  // Rate limiting check
  const now = Date.now();
  if (now - lastResetTime > 60000) { // 1 minute
    requestCount = 0;
    lastResetTime = now;
  }
  
  if (requestCount >= RATE_LIMIT) {
    return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
  }
  requestCount++;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await runMiddleware(req, res, upload.single("resumeFile"));

    const { jobDesc } = req.body;
    const resumePath = req.file?.path;

    if (!resumePath) {
      return res.status(400).json({ error: "Resume file is missing." });
    }

    // Read and parse resume
    const dataBuffer = fs.readFileSync(resumePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    // Set up Gemini - CORRECT MODEL NAMES:
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // For free tier (60 RPM limit):
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", // Correct model name
      // model: "gemini-1.0-pro", // Alternative free option
    });

    // Optimized prompt
    const prompt = `Analyze this job-resume match:
Job: ${jobDesc.substring(0, 2000)}... [truncated if too long]
Resume: ${resumeText.substring(0, 8000)}... [truncated if too long]

Respond in strict JSON format only:
{
  "summary": "brief match analysis",
  "resumeTips": ["3 concise suggestions"],
  "fitAnalysis": "short compatibility assessment"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const parsed = JSON.parse(text);
      return res.status(200).json(parsed);
    } catch (e) {
      console.error("Failed to parse response:", text);
      // Try to extract JSON if it's mixed with markdown
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return res.status(200).json(JSON.parse(jsonMatch[0]));
        } catch (e) {
          // Fall through to return raw text
        }
      }
      return res.status(200).json({
        summary: text,
        resumeTips: [],
        fitAnalysis: ""
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ 
      error: error.message,
      note: "Check your model name and API key",
      details: {
        possibleModels: ["gemini-1.5-flash", "gemini-1.0-pro"],
        freeTierInfo: "60 requests per minute limit"
      }
    });
  } finally {
    // Clean up uploaded file
    if(req.file.path){
     fs.unlinkSync(req.file.path);
    }
  }
}