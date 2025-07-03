
// import { upload } from '@/lib/multer'
// import { uploadOnCloudinary } from '@/lib/cloudinary'
// import { Job } from '@/models/job.model';
// import { runMiddleware } from '@/lib/runMiddleware';
// import connectDb from '@/lib/connectDB';

// export const config = { api: { bodyParser: false } }


// export default async function handler(req, res) {
//   //console.log("FILES RECEIVED: ", req.files);
//   // get user details from frontend
//   // check validation - data 
//   // check if already exists or not  a
//   // check for resume
//   // upload them to cloudiniary - resume
//   // create user object - create user entry in db
//   // remove some sensitive info 
//   // check for user creation
//   // return res
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }
//   try {
//     await connectDb()
//     const {
//       jobTitle,
//       jobLocation,
//       notes,
//       companyName,
//       jobDesc,
//       reminderDate,
//       status,
//       AiSummary,
//       AiTips,
//       AiMatchScore
//     } = req.body();

//     if ([jobTitle,
//       jobLocation,
//       notes,
//       companyName,
//       jobDesc,
//       reminderDate,
//       AiSummary,
//       AiTips,
//       AiMatchScore].some((field) =>
//         field?.trim() === "")) {
//       return res
//         .status(400)
//         .message("all fields are required")
//     }
//     // actiually this is if conditon to check ALL fields 🤣

    
//     const job = await Job.find({})








//     await runMiddleware(req, res, upload.single("resumeFile"));
//     const file = req.file;
//     if (!file) {
//       return res.status(400).json({ error: "Resume PDF is required" });
//     }



//   } catch (err) {
//     console.error("AddJob Error:", err);
//     return res.status(500).json({ error: err.message });
//   }
// }
