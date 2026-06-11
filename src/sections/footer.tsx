"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Heart,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import SunMark from "@/components/SunMark";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How it works" },
    { href: "/#about", label: "About" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const supportLinks = [
    { href: "#", label: "Help center" },
    { href: "#", label: "Privacy policy" },
    { href: "#", label: "Terms of service" },
    { href: "#", label: "FAQ" },
  ];

  const socialLinks = [
    { href: "#", icon: Twitter, label: "Twitter" },
    { href: "#", icon: Linkedin, label: "LinkedIn" },
    { href: "#", icon: Github, label: "GitHub" },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#261b10] text-paper">
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-10 lg:px-10">
        {/* Newsletter strip */}
        <div className="mb-16 flex flex-col gap-8 border-b border-dashed border-paper/15 pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-clay-wash/70">
              The occasional letter
            </span>
            <h3 className="mt-4 font-display text-3xl leading-snug text-paper lg:text-4xl">
              Job search notes, sent <em className="text-clay-wash">warmly</em>{" "}
              and rarely.
            </h3>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1 lg:w-80">
                <Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-paper/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-full border border-paper/20 bg-paper/5 py-3.5 pr-4 pl-11 text-sm text-paper placeholder-paper/40 transition-colors focus:border-clay focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="group flex items-center justify-center gap-2 rounded-full bg-clay px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-clay-deep"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Subscribed
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-6">
            <Link href="/" className="group mb-6 inline-flex items-center gap-3">
              <SunMark className="h-8 w-8 text-clay transition-transform duration-500 group-hover:-translate-y-0.5" />
              <span className="font-display text-2xl tracking-tight text-paper">
                Job <span className="italic">Trackr</span>
              </span>
            </Link>
            <p className="mb-8 max-w-sm leading-relaxed text-paper/60">
              A quiet companion for the job hunt — built with care in South
              Africa, for anyone in the thick of an already-hard chapter.
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-paper/20 text-paper/60 transition-colors duration-300 hover:border-clay hover:bg-clay hover:text-paper"
                >
                  <social.icon className="h-4 w-4" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3">
            <h4 className="mb-6 font-mono text-[10px] uppercase tracking-[0.24em] text-clay-wash/70">
              Quick links
            </h4>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-paper/60 underline decoration-transparent decoration-2 underline-offset-4 transition-all hover:text-paper hover:decoration-clay"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-3">
            <h4 className="mb-6 font-mono text-[10px] uppercase tracking-[0.24em] text-clay-wash/70">
              Support
            </h4>
            <ul className="space-y-3.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-paper/60 underline decoration-transparent decoration-2 underline-offset-4 transition-all hover:text-paper hover:decoration-clay"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-paper/10 pt-8 md:flex-row">
          <p className="font-mono text-[11px] tracking-[0.12em] text-paper/40">
            © {currentYear} Job Trackr. All rights reserved.
          </p>
          <p className="flex items-center gap-2 text-sm text-paper/40">
            Made with
            <Heart className="h-4 w-4 fill-clay text-clay" />
            in South Africa
          </p>
        </div>
      </div>

      {/* Giant watermark */}
      <div
        aria-hidden
        className="pointer-events-none relative -mb-8 overflow-hidden text-center lg:-mb-14"
      >
        <span className="font-display text-[22vw] leading-[0.78] tracking-tight whitespace-nowrap text-paper/[0.05] select-none lg:text-[15rem]">
          Job Trackr
        </span>
      </div>
    </footer>
  );
}
