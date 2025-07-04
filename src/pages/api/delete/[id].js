// import { deleteFromCloudinary } from "@/lib/cloudinary";
// import connectDb from "@/lib/connectDB";
// import { runMiddleware } from "@/lib/runMiddleware";
// import { verifyJwtMiddleware } from "@/middlewares/auth.middleware";
// import { authenticateUser } from "@/middlewares/authenticateUser.middleware";
// import { Job } from "@/models/job.model";

// export const config = { api: { bodyParser: false } };


// export default async function handler(req, res) {
//       if (req.method !== "DELETE") {
//         return res.status(405).json({ error: "Method not allowed" });
//     }
//     try {
//         await connectDb();
//         await runMiddleware(req, res, verifyJwtMiddleware); // to verify user is login or not
//         await runMiddleware(req, res, authenticateUser)
        
//     } catch (error) {
//         console.error("delete job error:", err);
//         return res.status(500).json({ error: err.message });
//     }
// }