// src/components/TopNavbar.jsx
"use client";
import { useRouter } from "next/navigation";

export default function TopNavbar() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
  };

  return (
    <div className="w-full h-16 bg-[#1b1b1e] border-b border-white/10 px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold">📊 Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-[#f02e65] cursor-pointer hover:bg-[#d42b59] px-4 py-1 rounded text-white"
      >
        Logout
      </button>
    </div>
  );
}
