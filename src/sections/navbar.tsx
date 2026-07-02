"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut, Settings } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import SunMark from "@/components/SunMark";

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

  // Shared by every auth-gated nav link: send signed-out visitors to sign in
  // instead of the page itself.
  const handleAuthGatedClick =
    (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      router.push(uid ? href : "/auth");
    };

  const handleSettings = () => {
    setIsProfileOpen(false);
    router.push("/settings");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", requiresAuth: true },
    { href: "/interviews", label: "Interviews", requiresAuth: true },
    { href: "/#features", label: "Features", requiresAuth: false },
    { href: "/#how-it-works", label: "How it works", requiresAuth: false },
    { href: "/#about", label: "About", requiresAuth: false },
  ];

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return pathname === href;
  };

  const desktopLinkClass = (active: boolean) =>
    `relative px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-200 ${
      active ? "text-clay" : "text-ink-soft hover:text-clay"
    }`;

  const mobileLinkClass = (active: boolean) =>
    `flex items-center px-4 py-3 rounded-xl font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
      active ? "bg-ink text-paper" : "text-ink-soft hover:bg-card hover:text-ink"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Wordmark */}
          <Link href="/" className="group flex items-center gap-2.5">
            <SunMark className="h-7 w-7 text-clay transition-transform duration-500 group-hover:-translate-y-0.5" />
            <span className="font-display text-xl tracking-tight text-ink">
              Job <span className="italic">Trackr</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              if (link.requiresAuth) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleAuthGatedClick(link.href)}
                    className={desktopLinkClass(active)}
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={desktopLinkClass(active)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right section */}
          <div className="hidden items-center gap-2 md:flex">
            {uid ? (
              <>
                <button
                  onClick={handleSettings}
                  className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors duration-200 hover:bg-card hover:text-ink"
                  aria-label="Settings"
                >
                  <Settings className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </button>

                {/* Avatar + dropdown */}
                <div className="relative ml-1" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-clay font-display text-base text-paper transition-shadow duration-200 ${
                      isProfileOpen
                        ? "ring-2 ring-clay ring-offset-2 ring-offset-paper"
                        : "hover:ring-2 hover:ring-line hover:ring-offset-2 hover:ring-offset-paper"
                    }`}
                  >
                    {email?.charAt(0).toUpperCase() || "U"}
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 z-50 mt-3 w-64 origin-top-right">
                      <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-[0_24px_48px_-20px_rgba(50,38,26,0.35)]">
                        <div className="border-b border-line px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-full bg-clay font-display text-lg text-paper">
                              {email?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-ink">
                                {email?.split("@")[0] || "User"}
                              </p>
                              <p className="truncate font-mono text-[11px] text-ink-faint">
                                {email}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-2">
                          <button
                            onClick={handleSettings}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper hover:text-ink"
                          >
                            <Settings className="h-4 w-4" strokeWidth={1.75} />
                            Settings
                          </button>
                          <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-rose/10 hover:text-rose"
                          >
                            <LogOut className="h-4 w-4" strokeWidth={1.75} />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push("/auth")}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-clay"
                >
                  Sign in
                </button>
                <button
                  onClick={() => router.push("/auth")}
                  className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors duration-300 hover:bg-clay"
                >
                  Get started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-card md:hidden"
          >
            <span className="sr-only">Toggle menu</span>
            {isMenuOpen ? (
              <X className="h-5 w-5" strokeWidth={1.75} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-1 border-t border-line bg-paper px-4 py-4">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            if (link.requiresAuth) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    handleAuthGatedClick(link.href)(e);
                    setIsMenuOpen(false);
                  }}
                  className={mobileLinkClass(active)}
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
                className={mobileLinkClass(active)}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Mobile auth section */}
          <div className="mt-3 border-t border-line pt-3">
            {uid ? (
              <>
                <div className="mb-2 rounded-xl bg-card px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-clay font-display text-paper">
                      {email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">
                        {email?.split("@")[0] || "User"}
                      </p>
                      <p className="truncate font-mono text-[11px] text-ink-faint">
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
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-ink-soft transition-colors hover:bg-card hover:text-ink"
                >
                  <Settings className="h-5 w-5" strokeWidth={1.75} />
                  Settings
                </button>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-ink-soft transition-colors hover:bg-rose/10 hover:text-rose"
                >
                  <LogOut className="h-5 w-5" strokeWidth={1.75} />
                  Sign out
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    router.push("/auth");
                    setIsMenuOpen(false);
                  }}
                  className="w-full rounded-xl px-4 py-3 text-left font-medium text-ink-soft transition-colors hover:bg-card hover:text-ink"
                >
                  Sign in
                </button>
                <button
                  onClick={() => {
                    router.push("/auth");
                    setIsMenuOpen(false);
                  }}
                  className="w-full rounded-full bg-ink px-4 py-3 text-center font-semibold text-paper transition-colors hover:bg-clay"
                >
                  Get started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
