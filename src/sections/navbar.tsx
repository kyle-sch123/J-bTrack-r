"use client";

import { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Logo from "@/assets/images/JobtrackerLogo.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const { uid, user, clearAuth } = useAuthStore();

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

  return (
    <nav className="border-b bg-[#fcf8f5] w-full z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-17">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="/">
                <img
                  src={Logo.src}
                  alt="J*b Tr*ckr Logo"
                  height={100}
                  width={100}
                  style={{ borderRadius: "100%", objectFit: "scale-down" }}
                />
              </a>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-evenly gap-3">
            <a
              href="/#features"
              className="hover:text-[#f78433] px-3 py-2 rounded-md transition-colors text-black/60"
            >
              Features
            </a>
            <a
              href="/#how-it-works"
              className="hover:text-[#f78433] px-3 py-2 rounded-md transition-colors text-black/60"
            >
              How it Works
            </a>
            <a
              href="/#about"
              className="hover:text-[#f78433] px-3 py-2 rounded-md transition-colors text-black/60"
            >
              About us
            </a>
            <a
              href="/dashboard"
              onClick={handleDashboardClick}
              className="hover:text-[#f78433] px-3 py-2 rounded-md transition-colors text-black/60"
            >
              Dashboard
            </a>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:block">
            {uid ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full bg-white text-black/60 flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <span className="font-medium text-black/60">
                    {user?.email?.split("@")[0] || "User"}
                  </span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-popover-foreground rounded-md shadow-lg border z-10">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium text-black/80">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 text-sm flex items-center space-x-2 text-black/60 hover:bg-amber-50 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push("/auth")}
                  className="text-black/90 text-sm hover:text-[#f78433] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push("/auth")}
                  className="text-white font-semibold text-sm bg-black py-2 px-4 rounded-md hover:bg-black/90 transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black/60 hover:text-black transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-[#fcf8f5]">
          <div className="px-4 py-4 space-y-2">
            <a
              href="/"
              className="block px-4 py-2.5 rounded-md text-black/60 hover:text-[#f78433] hover:bg-white/50 transition-colors"
            >
              Features
            </a>
            <a
              href="/"
              className="block px-4 py-2.5 rounded-md text-black/60 hover:text-[#f78433] hover:bg-white/50 transition-colors"
            >
              How it Works
            </a>
            <a
              href="/"
              className="block px-4 py-2.5 rounded-md text-black/60 hover:text-[#f78433] hover:bg-white/50 transition-colors"
            >
              Contact
            </a>
            <a
              href="/dashboard"
              onClick={handleDashboardClick}
              className="block px-4 py-2.5 rounded-md text-black/60 hover:text-[#f78433] hover:bg-white/50 transition-colors"
            >
              Dashboard
            </a>

            {/* Mobile Auth Section */}
            <div className="pt-3 border-t border-black/10">
              {uid ? (
                <>
                  <div className="px-4 py-2 mb-2">
                    <p className="text-sm font-medium text-black/80">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2.5 rounded-md text-black/60 hover:text-[#f78433] hover:bg-white/50 transition-colors flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      router.push("/auth");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-md text-black/60 hover:text-[#f78433] hover:bg-white/50 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      router.push("/auth");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-center text-white font-semibold text-sm bg-black py-2.5 px-4 rounded-md hover:bg-black/90 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
