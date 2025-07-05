import connectDb from "@/lib/connectDB";
import { Job } from "@/models/job.model";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    await connectDb();

    const today = new Date().toISOString().split("T")[0];

    const jobs = await Job.find({ followUpDate: today }).populate("userId");

    for (const job of jobs) {
      const userEmail = job.userId?.email;
      const jobTitle = job.title;
      const company = job.company || "the company";
      const appliedDate = job.appliedDate;

      if (!userEmail) continue;

      await resend.emails.send({
        from: "Job Tracker <onboarding@resend.dev>",
        to: [userEmail],
        subject: `⏰ Follow-Up Reminder: ${jobTitle}`,
        html: `
          <p>Hi ${job.userId?.name || "there"},</p>
          <p>Just a quick reminder to follow up on your job application:</p>
          <ul>
            <li><strong>Position:</strong> ${jobTitle}</li>
            <li><strong>Company:</strong> ${company}</li>
            <li><strong>Applied on:</strong> ${appliedDate}</li>
          </ul>
          <p>Good luck!</p>
          <p>— Job Tracker</p>
        `,
      });
    }

    return Response.json({ message: `Sent ${jobs.length} reminder email(s)` });
  } catch (error) {
    console.error("Follow-up email job error:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
