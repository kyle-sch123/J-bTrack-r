"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Heart,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

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
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#about", label: "About" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const supportLinks = [
    { href: "#", label: "Help Center" },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "FAQ" },
  ];

  const socialLinks = [
    { href: "#", icon: Twitter, label: "Twitter" },
    { href: "#", icon: Linkedin, label: "LinkedIn" },
    { href: "#", icon: Github, label: "GitHub" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fcf8f5] via-[#faf5f0] to-[#f5ebe3]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-amber-200/20 to-transparent rounded-full blur-3xl" />

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Top Section - Newsletter CTA */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f78433] to-[#ff6b35] rounded-3xl transform rotate-1" />
          <div className="relative bg-gradient-to-r from-[#f78433] to-[#ff6b35] rounded-3xl p-8 md:p-12 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-white/90 text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  Stay in the loop
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Get job search tips & updates
                </h3>
                <p className="text-white/80 max-w-md">
                  Join thousands of job seekers getting weekly insights delivered
                  to their inbox.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 lg:w-72">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="group flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
                  >
                    {subscribed ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Subscribed!
                      </>
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 group mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f78433] to-[#ff6b35] rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-[#f78433] to-[#ff6b35] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200/50">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Job Trackr
              </span>
            </Link>
            <p className="text-gray-600 mb-8 max-w-sm leading-relaxed">
              Your personal job search companion. Built with passion in South
              Africa to help you land your dream job.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="group relative w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f78433] to-[#ff6b35] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <social.icon className="relative w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-[#f78433] to-[#ff6b35] mr-0 group-hover:mr-3 transition-all duration-300" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">
              Support
            </h4>
            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-[#f78433] to-[#ff6b35] mr-0 group-hover:mr-3 transition-all duration-300" />
                    <span className="font-medium">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-orange-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} Job Trackr. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              Made with
              <span className="relative">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <Heart className="w-4 h-4 text-red-500 fill-red-500 absolute inset-0 animate-ping opacity-75" />
              </span>
              in South Africa
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
