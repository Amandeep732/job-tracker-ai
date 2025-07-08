// src/app/dashboard/layout.jsx
import Sidebar from "@/components/Sidebar/page";
import TopNavbar from "@/components/TopNavbar/page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const cookie = await cookies();
  const token = cookie.get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#0e0e0e] text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNavbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
