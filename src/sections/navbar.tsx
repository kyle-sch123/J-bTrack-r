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
    <nav className="border-b bg-[#fcf8f5]  w-full z-50 ">
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
              href="/"
              className="hover:text-[#f78433] px-3 py-2 rounded-md transition-colors text-black/60"
            >
              Features
            </a>
            <a
              href="/"
              className="hover:text-[#f78433] px-3 py-2 rounded-md transition-colors text-black/60"
            >
              How it Works
            </a>
            <a
              href="/"
              className="hover:text-[#f78433] px-3 py-2 rounded-md transition-colors text-black/60"
            >
              Contact
            </a>
            <a
              href="/dashboard"
              onClick={handleDashboardClick}
              className="hover:text-[#f78433] px-3 py-2 rounded-md transition-colors text-black/60"
            >
              Dashboard
            </a>
          </div>
          <div>
            {uid ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 rounded-full bg-white text-black/60 flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <span className="font-medium text-black/60">
                    {user?.email?.split("@")[0] || "User"}
                  </span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-popover-foreground rounded-md shadow-lg border p-2">
                    <div className="px-1 py-2 border-b">
                      <p className="text-sm font-medium text-black/60">
                        {user?.email}
                      </p>
                      {/* <p className="text-xs text-muted-foreground truncate text-black/60">
                        ID: {uid?.substring(0, 8)}...
                      </p> */}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full justify-start mt-1.5 text-sm flex items-center space-x-2 text-black/60"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => router.push("/auth")}
                  className="text-black/90 text-sm"
                >
                  {" "}
                  Sign In
                </button>
                <button
                  onClick={() => router.push("/auth")}
                  className="text-white font-semibold text-sm bg-black py-2 px-3 rounded-md"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="px-3 py-3 space-y-1">
            <a
              href="/"
              className="block px-3 py-2 rounded-md  hover:text-foreground hover:bg-accent transition-colors"
            >
              Home
            </a>
            <a
              href="/dashboard"
              onClick={handleDashboardClick}
              className="block px-3 py-2 rounded-md text-black/60 hover:text-[#f78433] transition-colors"
            >
              Dashboard
            </a>

            {uid ? (
              <>
                <div className="px-3 py-2 border-t mt-2">
                  <p className="text-sm text-black/60 font-medium text-black/">
                    {user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ID: {uid?.substring(0, 12)}...
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full justify-start mt-1 text-sm flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                className="w-full mt-2"
                onClick={() => router.push("/auth")}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
