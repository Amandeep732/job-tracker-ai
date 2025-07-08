// src/components/Sidebar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Optional: className merging helper

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Applications", href: "/dashboard/applications" },
  { label: "Add Job", href: "/dashboard/add" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#1b1b1e] border-r border-white/10 p-6">
      <h2 className="text-2xl font-bold text-[#f02e65] mb-8">Job Tracker</h2>
      <nav className="space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block px-4 py-2 rounded hover:bg-[#f02e65]/10",
              pathname === item.href && "bg-[#f02e65]/20 text-[#f02e65]"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
