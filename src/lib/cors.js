import Cors from "cors";
import initMiddleware from "./init-middleware";

const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "PATCH", "DELETE"],
    origin: [
      "http://localhost:3000",
      "https://job-tracker-nine-henna.vercel.app/", // 🟢 Replace with your actual domain
    ],
    credentials: true, // ✅ Required for cookies
  })
);

export default cors;
