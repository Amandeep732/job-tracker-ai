# 💼 Job Tracker

A full-stack web application to efficiently manage and track your job applications, statuses, and overall job search progress.

## 🔗 Live Demo

Check out the live project: [https://job-tracker-nine-henna.vercel.app/](https://job-tracker-nine-henna.vercel.app/)

GitHub Repository: [https://github.com/Amandeep732/job-tracker-ai](https://github.com/Amandeep732/job-tracker-ai)


## ✨ Features

🧠 AI-Powered Resume Suggestions
Get intelligent tips on improving your resume based on the job you apply to.

🔐 JWT-Based Authentication
Secure login system using JSON Web Tokens and middleware for route protection.

☁️ Cloud File Uploads
Upload resumes and other documents with production-ready file handling.

✅ Add Job Applications
Quickly add new job applications with details like job title, company, location, and status.

🔄 Update Application Status
Easily update application stages—e.g., Applied, Interviewing, Offered, Rejected.

🗑️ Delete Applications
Remove job applications with inline confirmation to keep your list clean.

📊 View Dashboard Stats
Get insights like total applications, interviews scheduled, and profile completion percentage.

📱 Mobile Responsive Design
Fully optimized UI for mobile, tablet, and desktop devices.

## 📸 Screenshots

![Dashboard Screenshot](public/screenshot/Screenshot%202025-07-07%20133338.png)
![AI Generated ScreenShot Screenshot](public/screenshot/Screenshot%202025-07-13%20230914.png)

## 🛠️ Tech Stack

- Next.js 15 (App Router)
- Tailwind CSS
- MongoDB (Mongoose)
- JWT Authentication
- Vercel (Hosting)

## 📦 Getting Started

1. Clone the repo

```bash
git clone https://github.com/Amandeep732/job-tracker-ai
cd job-tracker

npm install

MONGODB_URI=your mongodb
JWT_ACCESS_EXPIRY=your access expiry
JWT_REFRESH_SECRET=your refresh expriy
JWT_REFRESH_EXPIRY=your refresh expiry
CLOUDINARY_NAME=your cloudinary name 
CLOUDINARY_API_KEY=your api key
CLOUDINARY_API_SECRET=your api secret
GEMINI_API_KEY=your gemini for AI (Google AI studio)
UPSTASH_REDIS_REST_URL=your redish URL
UPSTASH_REDIS_REST_TOKEN=your token
RESEND_API_KEY=your resend api key

npm run dev


## 👨‍💻 Author

- **Achal Tanwar**
- GitHub: [profile](https://github.com/Amandeep732)

## 📜 License

This project is licensed under the MIT License.

