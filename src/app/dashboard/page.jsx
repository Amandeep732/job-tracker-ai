"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalApps: 0,
    interviewsCount: 0,
    profileCompletion: 0,
  });
  console.log(`total apps is ${stats.totalApps}`);

  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState({ username: "" });

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
    // Fetch dashboard stats
    fetch("/api/user/stats")
      .then((res) => res.json())
      .then((data) => {
        //console.log("Stats Data:", data); // 👈 ADD THIS
        setStats(data);
      })
      .catch((err) => console.error("Stats fetch error:", err));
    // Fetch recent activities
    fetch("/api/user/activity")
      .then((res) => res.json())
      .then((data) => {
        console.log("activity is :", data);
        setActivities(data.activities)
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Welcome, {user?.username || "User"} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here’s your job application summary
        </p>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Applications Card */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow">
          <h2 className="text-sm uppercase text-gray-500 dark:text-gray-400">
            Total Applications
          </h2>
          <p className="text-3xl text-black font-bold mt-2">{stats.totalApps}</p>
        </div>

        {/* Interviews Scheduled Card */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow">
          <h2 className="text-sm uppercase text-gray-500 dark:text-gray-400">
            Interviews Scheduled
          </h2>
          <p className="text-3xl text-black  font-bold mt-2">{stats.interviewsCount}</p>
        </div>

        {/* Profile Completion Card */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow">
          <h2 className="text-sm uppercase text-gray-500 dark:text-gray-400">
            Profile Completion
          </h2>
          <p className="text-3xl text-black  font-bold mt-2">{stats.profileCompletion}%</p>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <ul className="space-y-2">
          {activities.length > 0 ? (
            activities.map((act, idx) => (
              <li
                key={idx}
                className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center"
              >
                <span className="mr-3">•</span>
                <span className="text-gray-700 dark:text-gray-300">{act.message}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500 dark:text-gray-400">
              No recent activity.
            </li>
          )}
        </ul>
      </div>

      {/* Quick Actions */}
      <div>
        <button
          onClick={() => router.push("/add-job")}
          className="px-5 cursor-pointer py-2 bg-pink-500 text-white rounded-2xl shadow hover:bg-pink-600"
        >
          Add New Job
        </button>
      </div>
    </div>
  );
}
