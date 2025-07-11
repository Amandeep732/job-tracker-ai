"use client";
import { useEffect, useState } from "react";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function JobTable() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/jobs/getAll");
      setJobs(res.data?.message === "User has no existing jobs" ? [] : res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleUpdate = (job) => {
    router.push(`/dashboard/update/${job._id}?${new URLSearchParams({ jobData: JSON.stringify(job) })}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await api.delete(`/delete/${id}`);
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-200 rounded-md">
        <thead className="bg-gray-100 text-gray-700 text-left">
          <tr>
            <th className="p-3 border-b">Job Title</th>
            <th className="p-3 border-b">Company</th>
            <th className="p-3 border-b">Status</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan="4" className="text-center p-4">Loading...</td></tr>
          ) : jobs?.length === 0 ? (
            <tr><td colSpan="4" className="text-center p-4 text-gray-500">No jobs found.</td></tr>
          ) : (
            jobs.map((job) => (
              <tr key={job._id} className="">
                <td className="p-3 border-b">{job.jobTitle}</td>
                <td className="p-3 border-b">{job.companyName}</td>
                <td className="p-3 border-b">{job.status}</td>
                <td className="p-3 border-b">
                  <div className="flex gap-3">
                    <button onClick={() => handleUpdate(job)} className="text-blue-600 cursor-pointer hover:underline flex items-center gap-1">
                      <Pencil size={16} /> Update
                    </button>
                    <button onClick={() => handleDelete(job._id)} className="text-red-600 cursor-pointer hover:underline flex items-center gap-1">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}