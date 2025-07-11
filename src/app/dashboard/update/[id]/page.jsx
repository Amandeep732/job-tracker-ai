"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/api";


export default function UpdateJobPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Auto-fill from URL state or fetch from API
  useEffect(() => {
    const jobData = searchParams.get("jobData");
    if (jobData) {
      setJob(JSON.parse(jobData));
      console.log(job);
    } else {
      api.get(`/jobs/${id}`).then((res) => setJob(res.data));
    }
  }, [id, searchParams]);

  // 2. Handle file upload
  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  // 3. Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("jobTitle", e.target.jobTitle.value);
    formData.append("companyName", e.target.companyName.value);
    formData.append("jobDesc", e.target.jobDesc.value);
    formData.append("jobLocation", e.target.jobLocation.value);
    formData.append("status", e.target.status.value);
    // Append all other fields...
    if (resumeFile) formData.append("resumeFile", resumeFile);

    try {
      const res = await api.patch(`/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      router.push("/dashboard?updated=true");
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Update Job</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Job Title*</label>
            <input
              type="text"
              name="jobTitle"
              defaultValue={job.jobTitle}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Job Location*</label>
            <input
              type="text"
              name="jobLocation"
              defaultValue={job.jobLocation}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Company Name*</label>
            <input
              type="text"
              name="companyName"
              defaultValue={job.companyName}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Job Description*</label>
            <input
              type="text"
              name="jobDesc"
              defaultValue={job.jobDesc}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block mb-1">Resume (PDF only)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          {job.resumeFile && (
            <p className="mt-2 text-sm">
              Current:{" "}
              <a
                href={job.resumeFile}
                target="_blank"
                className="text-blue-400"
              >
                View Resume
              </a>
            </p>
          )}
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block mb-1">Status*</label>
          <select
            name="status"
            defaultValue={job.status}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            required
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#f02e65] px-6 py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update Job"}
        </button>
      </form>
    </div>
  );
}
