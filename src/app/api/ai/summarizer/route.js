// import { GoogleGenerativeAI } from "@google/generative-ai";

// export async function POST(req) {
//   try {
//     const { jobDesc, resumeFile } = await req.json();

//     if (!jobDesc || !resumeFile) {
//       return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
//     }

//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//     const prompt = `You are an expert career assistant.
//     Job Description:
//     ${jobDesc}
//     User Resume:
// ${resumeFile}

// Respond in this JSON format:
// {
//   "summary": "...",
//   "resumeTips": ["...", "...", "..."],
//   "fitAnalysis": "..."
// }
// `.trim();

//     const result = await model.generateContent(prompt);
//     const rawText = await result.response.text();

//     // Optional: try to parse JSON
//     try {
//       const parsed = JSON.parse(rawText);
//       return new Response(JSON.stringify(parsed), { status: 200 });
//     } catch (e) {
//       return new Response(
//         JSON.stringify({ error: "Gemini response is not valid JSON", raw: rawText }),
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("Gemini 1.5 API Error:", error);
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//   }
// }
