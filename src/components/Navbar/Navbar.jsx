"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Briefcase, PlusCircle, ClipboardList, UserCircle, LogIn, LogOut, UserPlus, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/UseAuth";

// Base navigation items (always visible)
const baseNavItems = [];

// Auth-dependent navigation items
const authNavItems = [
  {
    label: "Profile",
    href: "/profile",
    icon: <UserCircle className="w-4 h-4 mr-2" />,
  },
  {
    label: "DashBoard",
    href: "/",
    icon: <Briefcase className="w-4 h-4 mr-2" />,
  },
  {
    label: "Add Job",
    href: "/add-job",
    icon: <PlusCircle className="w-4 h-4 mr-2" />,
  },
  {
    label: "Logout",
    href: "/logout",
    icon: <LogOut className="w-4 h-4 mr-2" />,
  }
];

const unauthNavItems = [
  {
    label: "Login",
    href: "/login",
    icon: <LogIn className="w-4 h-4 mr-2" />,
  },
  {
    label: "Register",
    href: "/signup",
    icon: <UserPlus className="w-4 h-4 mr-2" />,
  }
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const { isLoggedIn } = useAuth();
  //const isLoggedIn = true;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Combine base items with auth-dependent items
  const filteredNavItems = [
    ...baseNavItems, ...(isLoggedIn ? authNavItems : unauthNavItems)
  ];

  return (
    <nav className={`
      bg-[#1a1a1a] 
      border-b border-white/10 
      px-4 sm:px-6 py-4 
      flex justify-between items-center 
      sticky top-0 z-50 
      transition-all duration-300
      ${isScrolled ? 'backdrop-blur-sm bg-opacity-90' : 'bg-opacity-100'}
    `}>
      <div className="flex items-center justify-between w-full">
        <div className="text-2xl font-bold text-white">
          Job<span className="text-[#f02e65]">Tracker</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {filteredNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`
                  cursor-pointer 
                  w-fit px-4 
                  flex items-center 
                  transition-all duration-200 
                  hover:bg-white/10
                  ${pathname === item.href
                    ? "text-[#f02e65] bg-white/5"
                    : "text-white/80 hover:text-white"
                  }
                `}
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white/10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#1a1a1a] border-t border-white/10 p-4 flex flex-col gap-2">
          {filteredNavItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Button
                variant="ghost"
                className={`
                  w-full justify-start
                  cursor-pointer 
                  px-4 py-2
                  flex items-center 
                  transition-all duration-200 
                  hover:bg-white/10
                  ${pathname === item.href
                    ? "text-[#f02e65] bg-white/5"
                    : "text-white/80 hover:text-white"
                  }
                `}
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}