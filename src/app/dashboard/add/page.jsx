"use client";
import axios from "axios";
import { useState } from "react";

export default function AddJobForm() {
  // Initialize all fields with empty strings to prevent uncontrolled inputs
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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setError(null); // Clear errors on change

    if (name === "resumeFile") {
      setFormData((prev) => ({ ...prev, resumeFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddJob = async () => {
    try {
      setError(null);
      setLoading(true);

      const form = new FormData();
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          console.log(key, value)
          form.append(key, value);
        }
      });

      // Append AI-generated data
      form.append("AiSummary", aiSummary);
      form.append("AiTips", JSON.stringify(aiTips));
      form.append("AiMatchScore", aiMatchScore);

      const res = await axios.post("/api/addjob", form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setSuccess("Job added with AI insights!");
      resetForm();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      jobTitle: "",
      companyName: "",
      jobLocation: "",
      jobDesc: "",
      notes: "",
      reminderDate: "",
      resumeFile: null,
    });
    setAiSummary("");
    setAiTips([]);
    setAiMatchScore(null);
  };

  const handleGenerateAI = async () => {
    if (!formData.jobDesc || !formData.resumeFile) {
      setError("Please add job description and resume first");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("jobDesc", formData.jobDesc);
      form.append("resumeFile", formData.resumeFile);

      const res = await axios.post("/api/ai/summarizer", form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setAiSummary(res.data.summary || "");
      setAiTips(res.data.resumeTips || []);
      setAiMatchScore(res.data.fitAnalysis || null);
    } catch (error) {
      if (error.response?.status === 429) {
        setError(
          "⚠️ You're hitting the AI usage limit. Please wait and try again later."
        );
      } else {
        setError(
          error.response?.data?.error || "Failed to generate AI insights"
        );
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

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-900 text-red-100 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-900 text-green-100 rounded-md">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="jobTitle"
          placeholder="Job Title *"
          className="p-3 rounded-md bg-zinc-800 w-full focus:outline-none"
          onChange={handleChange}
          value={formData.jobTitle}
          required
        />

        <input
          type="text"
          name="companyName"
          placeholder="Company Name *"
          className="p-3 rounded-md bg-zinc-800 w-full focus:outline-none"
          onChange={handleChange}
          value={formData.companyName}
          required
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
          placeholder="Job Description *"
          className="p-3 rounded-md bg-zinc-800 w-full focus:outline-none"
          rows={5}
          onChange={handleChange}
          value={formData.jobDesc}
          required
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

        <div className="space-y-1">
          <label className="block text-sm text-gray-400">Resume (PDF) *</label>
          <input
            type="file"
            name="resumeFile"
            accept=".pdf"
            className="p-3 rounded-md bg-zinc-800 w-full focus:outline-none"
            onChange={handleChange}
            required
          />
          {formData.resumeFile && (
            <p className="text-sm text-gray-400">
              Selected: {formData.resumeFile.name}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleAddJob}
          className="w-full cursor-pointer sm:w-auto px-6 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg font-semibold text-center"
          disabled={loading}
        >
          {loading ? "Processing..." : "Add Job"}
        </button>

        <button
          onClick={handleGenerateAI}
          className="w-full cursor-pointer sm:w-auto px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-center"
          disabled={loading || !formData.jobDesc || !formData.resumeFile}
        >
          Generate AI Summary
        </button>
      </div>

      {loading && (
        <p className="mt-4 text-sm text-gray-400 text-center">
          ⏳ Processing your request...
        </p>
      )}

      {/* AI Results */}
      {(aiSummary || aiTips.length || aiMatchScore !== null) && (
        <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
          <h2 className="text-xl font-bold text-pink-300 mb-2">AI Insights:</h2>
          {aiSummary && (
            <div className="mb-3">
              <strong className="text-purple-300">Summary:</strong>
              <p className="mt-1">{aiSummary}</p>
            </div>
          )}
          {aiMatchScore !== null && (
            <div className="mb-3">
              <strong className="text-purple-300">Match Score:</strong>
              <p className="mt-1">{aiMatchScore}%</p>
            </div>
          )}
          {aiTips.length > 0 && (
            <div>
              <strong className="text-purple-300">Resume Tips:</strong>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {aiTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
