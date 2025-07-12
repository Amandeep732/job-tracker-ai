// src/lib/multer.js
import multer from "multer";
import fs from "fs";
import path from "path";

// Use /tmp on Vercel, ./public/temp locally
const isProd = process.env.NODE_ENV === "production";
const tempDir = isProd ? "/tmp/resume-temp" : path.join(process.cwd(), "public", "temp");

// Ensure directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${unique}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF or DOCX files are allowed"), false);
  },
});
