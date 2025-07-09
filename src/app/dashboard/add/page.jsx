"use client";
import axios from "axios";
import { useState } from "react";

export default function AddJobForm() {
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    jobLocation: "",
    jobDesc: "",
    notes: "",
    reminderDate: "",
    resumeFile: null,
  });

  const [aiSummary, setAiSummary] = useState("");
  const [aiTips, setAiTips] = useState([]);
  const [aiMatchScore, setAiMatchScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resumeFile") {
      setFormData({ ...formData, resumeFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddJob = async () => {
    try {
      const form = new FormData();
      form.append("jobTitle", formData.jobTitle);
      form.append("companyName", formData.companyName);
      form.append("jobLocation", formData.jobLocation);
      form.append("jobDesc", formData.jobDesc);
      form.append("notes", formData?.notes);
      form.append("reminderDate", formData.reminderDate);
      form.append("resumeFile", formData.resumeFile);
     
      const res = await axios.post("/api/addjob", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log("Success:", res.data);
      setFormData(res.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("jobDesc", formData.jobDesc);
      form.append("resumeFile", formData.resumeFile);

      const res = await axios.post("/api/ai/summarizer", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      console.log("Success:", res.data);
      setAiSummary(res.data.summary);
      setAiTips(res.data.resumeTips);
      setAiMatchScore(res.data.fitAnalysis);
    } catch (error) {
      if (error.response?.status === 429) {
      alert("⚠️ You're hitting the AI usage limit. Please wait and try again later.");
    } else {
      console.error("AI Error:", error.response?.data || error.message);
    }
    } finally {
      
    setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8 bg-zinc-900 text-white rounded-2xl shadow-lg">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-pink-400 text-center">
        Add New Job
      </h1>

      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="jobTitle"
          placeholder="Job Title"
          className="p-3 rounded-md bg-zinc-800 w-full focus:outline-none"
          onChange={handleChange}
          value={formData.jobTitle}
        />

        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          className="p-3 rounded-md bg-zinc-800 w-full focus:outline-none"
          onChange={handleChange}
          value={formData.companyName}
        />

        <input
          type="text"
          name="jobLocation"
          placeholder="Job Location"
          className="p-3 rounded-md bg-zinc-800 w-full focus:outline-none"
          onChange={handleChange}
          value={formData.jobLocation}
        />

        <textarea
          name="jobDesc"
          placeholder="Job Description"
          className="p-3 rounded-md bg-zinc-800 w-full focus:outline-none"
          rows={5}
          onChange={handleChange}
          value={formData.jobDesc}
        />

        <textarea
          name="notes"
          placeholder="Personal Notes (Optional)"
          className="p-3 rounded-md bg-zinc-800 w-full focus:outline-none"
          rows={2}
          onChange={handleChange}
          value={formData.notes}
        />

        <input
          type="date"
          name="reminderDate"
          className="p-3 rounded-md bg-zinc-800 w-full focus:outline-none"
          onChange={handleChange}
          value={formData.reminderDate}
        />

        <input
          type="file"
          name="resumeFile"
          accept=".pdf"
          className="p-3 rounded-md bg-zinc-800 w-full focus:outline-none"
          onChange={handleChange}
        />
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleAddJob}
          className="w-full cursor-pointer sm:w-auto px-6 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg font-semibold text-center"
        >
          Add Job
        </button>

        <button
          onClick={handleGenerateAI}
          className="w-full cursor-pointer sm:w-auto px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-center"
        >
          Generate AI Summary
        </button>
      </div>
      {/* Loader under buttons */}
      {loading && (
        <p className="mt-4 text-sm text-gray-400 text-center">
          ⏳ Generating AI insights...
        </p>
      )}

      {/* AI Results */}
      {(aiSummary || aiTips.length || aiMatchScore !== null) && (
        <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
          <h2 className="text-xl font-bold text-pink-300 mb-2">AI Insights:</h2>
          {aiSummary && (
            <p>
              <strong>Summary:</strong> {aiSummary}
            </p>
          )}
          {aiMatchScore !== null && (
            <p>
              <strong>Match Score:</strong> {aiMatchScore}%
            </p>
          )}
          {aiTips.length > 0 && (
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {aiTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
