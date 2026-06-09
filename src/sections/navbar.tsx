"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut, Settings } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Logo from "@/assets/images/JobtrackerLogo-transparent.png";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { uid, email, clearAuth } = useAuthStore();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      clearAuth();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDashboardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (uid) {
      router.push("/dashboard");
    } else {
      router.push("/auth");
    }
  };

  const handleSettings = () => {
    setIsProfileOpen(false);
    router.push("/settings");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", requiresAuth: true },
    { href: "/#features", label: "Features", requiresAuth: false },
    { href: "/#how-it-works", label: "How it Works", requiresAuth: false },
    { href: "/#about", label: "About", requiresAuth: false },
  ];

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return pathname === href;
  };

  return (
    <nav className="w-full z-100 p-2 bg-[#fff8ef]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={Logo.src}
              alt="Job Trackr Logo"
              height={125}
              width={125}
              className="rounded-xl object-cover"
            />
          </Link>

          {/* Center Navigation - Pill Container */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-1 p-1 bg-white rounded-full border border-gray-200 shadow-sm">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                if (link.requiresAuth && link.href === "/dashboard") {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={handleDashboardClick}
                      className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                        active
                          ? "bg-gray-900 text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      active
                        ? "bg-gray-900 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-2">
            {uid ? (
              <>
                {/* Icon Buttons */}
                <button
                  onClick={handleSettings}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-white border border-transparent hover:border-gray-200 transition-all duration-200"
                >
                  <Settings className="w-5 h-5" />
                </button>
                {/* User Avatar */}
                <div className="relative ml-1" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                      isProfileOpen
                        ? "border-[#f78433] ring-4 ring-orange-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-[#f78433] to-[#ff6b35] flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {email?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute z-100 right-0 mt-2 w-64 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 overflow-hidden">
                        {/* User Info Header */}
                        <div className="px-4 py-4 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#f78433] to-[#ff6b35] flex items-center justify-center">
                              <span className="text-white text-lg font-semibold">
                                {email?.charAt(0).toUpperCase() || "U"}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {email?.split("@")[0] || "User"}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <button
                            onClick={handleSettings}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                          >
                            <Settings className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">Settings</span>
                          </button>
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-red-50 rounded-xl transition-colors group"
                          >
                            <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-600 transition-colors" />
                            <span className="font-medium group-hover:text-red-600 transition-colors">
                              Sign Out
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/auth")}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push("/auth")}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#f78433] hover:bg-[#e57429] rounded-full transition-colors shadow-sm"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-white border border-transparent hover:border-gray-200 transition-all"
          >
            <span className="sr-only">Toggle menu</span>
            {isMenuOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 bg-[#fcf8f5] border-t border-gray-200 space-y-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            if (link.requiresAuth && link.href === "/dashboard") {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    handleDashboardClick(e);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${
                    active
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${
                  active
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Mobile Auth Section */}
          <div className="pt-3 mt-3 border-t border-gray-100">
            {uid ? (
              <>
                <div className="px-4 py-3 mb-2 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f78433] to-[#ff6b35] flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {email?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {email?.split("@")[0] || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {email}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleSettings();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  <Settings className="w-5 h-5 text-gray-500" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    router.push("/auth");
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium text-left"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    router.push("/auth");
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-full bg-[#f78433] text-white font-semibold text-center hover:bg-[#e57429] transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
