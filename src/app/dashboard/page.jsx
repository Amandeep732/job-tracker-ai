"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalApps: 0,
    interviewsCount: 0,
    profileCompletion: 0,
  });

  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 💥

  const [user, setUser] = useState({ username: "" });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userRes, statsRes, activityRes] = await Promise.all([
          fetch("/api/user/me"),
          fetch("/api/user/stats"),
          fetch("/api/user/activity"),
        ]);

        const userData = await userRes.json();
        const statsData = await statsRes.json();
        const activityData = await activityRes.json();
        console.log(statsData);
        setUser(userData);
        setStats(statsData);
        setActivities(activityData.activities);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false); // ✅ After all done
      }
    };

    fetchAll();
  }, []);
  const handleDeleteActivity = async (activityId) => {
  try {
    const response = await fetch(`/api/user/deleteActivity/${activityId}`, {
      method: "DELETE",
    });
    setActivities(activities.filter((act)=> act._id !== activityId));
  } catch (error) {
    console.error("Error deleting activity:", error);
  }
};

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-300">
        Loading your dashboard...
      </div>
    );
  }

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
          <p className="text-3xl text-black font-bold mt-2">
            {stats.totalApps}
          </p>
        </div>

        {/* Interviews Scheduled Card */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow">
          <h2 className="text-sm uppercase text-gray-500 dark:text-gray-400">
            Interviews Scheduled
          </h2>
          <p className="text-3xl text-black  font-bold mt-2">
            {stats.interviewsCount}
          </p>
        </div>

        {/* Profile Completion Card */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow">
          <h2 className="text-sm uppercase text-gray-500 dark:text-gray-400">
            Profile Completion
          </h2>
          <p className="text-3xl text-black  font-bold mt-2">
            {stats.profileCompletion}%
          </p>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <ul className="space-y-2">
          {activities?.length > 0 ? (
            activities.map((act, idx) => (
              <li
                key={idx}
                className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="mr-3">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {act.message}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteActivity(act._id)}
                  className="text-red-500 cursor-pointer mr-4 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 ml-2"
                  aria-label="Delete activity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
          onClick={() => router.push("/dashboard/add")}
          className="px-5 cursor-pointer py-2 bg-pink-500 text-white rounded-2xl shadow hover:bg-pink-600"
        >
          Add New Job
        </button>
      </div>
    </div>
  );
}
