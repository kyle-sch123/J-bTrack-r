"use client";

import { useState } from "react";
import {
  Plus,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Target,
  Calendar,
  FileText,
  BarChart3,
  Bell,
  Users,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/sections/navbar";
import HeroSection from "@/sections/heroSection";
import Footer from "@/sections/footer";
import { useAuthStore } from "@/store/authStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/featuresCard";

const features = [
  {
    icon: FileText,
    title: "Application Tracking",
    description:
      "Keep track of every job application with detailed status updates and notes.",
    color: "pastel-blue",
  },
  {
    icon: Calendar,
    title: "Interview Scheduling",
    description:
      "Never miss an interview with built-in calendar integration and reminders.",
    color: "pastel-coral",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Visualize your job search progress with comprehensive charts and insights.",
    color: "pastel-green",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Get timely reminders for follow-ups, deadlines, and upcoming interviews.",
    color: "pastel-purple",
  },
  {
    icon: Users,
    title: "Contact Management",
    description:
      "Organize your professional network and track recruiter interactions.",
    color: "pastel-yellow",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your job search data is encrypted and kept completely confidential.",
    color: "pastel-lavender",
  },
];

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const uid = useAuthStore((state) => state.uid);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
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
    <div className="min-h-screen bg-white">
      {/*N A V B A R */}
      <Navbar />
      {/* Hero Section */}
      <HeroSection />
      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-[#fff7ed]"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold text-[#f78433] bg-orange-50 px-4 py-2 rounded-full">
                Features
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Everything You Need to Land{" "}
              <span className="text-[#f78433]">Your Next Job</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your job search and
              maximize your success rate.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              // Define color schemes for each feature
              const colorSchemes = [
                {
                  bg: "bg-blue-50",
                  icon: "text-blue-600",
                  hover: "hover:border-blue-200",
                  hoverBg: "group-hover:bg-blue-100",
                },
                {
                  bg: "bg-orange-50",
                  icon: "text-orange-600",
                  hover: "hover:border-orange-200",
                  hoverBg: "group-hover:bg-orange-100",
                },
                {
                  bg: "bg-green-50",
                  icon: "text-green-600",
                  hover: "hover:border-green-200",
                  hoverBg: "group-hover:bg-green-100",
                },
                {
                  bg: "bg-purple-50",
                  icon: "text-purple-600",
                  hover: "hover:border-purple-200",
                  hoverBg: "group-hover:bg-purple-100",
                },
                {
                  bg: "bg-amber-50",
                  icon: "text-amber-600",
                  hover: "hover:border-amber-200",
                  hoverBg: "group-hover:bg-amber-100",
                },
                {
                  bg: "bg-indigo-50",
                  icon: "text-indigo-600",
                  hover: "hover:border-indigo-200",
                  hoverBg: "group-hover:bg-indigo-100",
                },
              ];

              const colors = colorSchemes[index % colorSchemes.length];

              return (
                <div key={index} className="group">
                  <Card
                    className={`h-full border-2 border-gray-100 ${colors.hover} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
                  >
                    <CardHeader>
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${colors.bg} ${colors.hoverBg} shadow-sm transition-colors`}
                      >
                        <feature.icon className={`h-8 w-8 ${colors.icon}`} />
                      </div>
                      <CardTitle className="text-2xl text-gray-900">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base text-gray-600 leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* About Section */}
      <section
        id="about"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#fcf8f5]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="order-2 md:order-1">
              <div className="inline-block mb-4">
                <span className="text-sm font-semibold text-[#f78433] bg-orange-50 px-4 py-2 rounded-full">
                  About Us
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Built by a Developer,
                <span className="text-[#f78433]"> For Job Seekers</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Job Trackr is a passion project created by a sole South African
                developer. Setting out with the purpose to automate and combat a
                lot of the tedious processes related to job hunting. Hopefully
                making a yet already stressful chapter of your life a little bit
                easier.
              </p>

              <div className="space-y-5">
                <div className="flex items-start group">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-green-100 transition-colors">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold mb-1">
                      100% Free to Use
                    </p>
                    <p className="text-gray-600 text-sm">
                      No hidden fees, no premium tiers. Just a tool to help you
                      succeed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <CheckCircle className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold mb-1">
                      Built with Care
                    </p>
                    <p className="text-gray-600 text-sm">
                      Every feature designed to solve real job search
                      challenges.
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-purple-100 transition-colors">
                    <CheckCircle className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold mb-1">
                      Continuously Improving
                    </p>
                    <p className="text-gray-600 text-sm">
                      Regular updates and new features based on user feedback.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="order-1 md:order-2">
              <div className="relative">
                {/* Main card */}
                <div className="bg-gradient-to-br from-[#f78433] to-[#ff6b35] rounded-3xl p-12 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <div className="text-center text-white">
                    <div className="text-7xl mb-6 animate-bounce">🇿🇦</div>
                    <p className="text-3xl font-bold mb-3">
                      Made in South Africa
                    </p>
                    <p className="text-lg text-orange-100 mb-6">
                      With passion & purpose
                    </p>
                    <div className="flex justify-center gap-4 text-sm">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                        <p className="font-semibold">🎯 Focused</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                        <p className="font-semibold">💪 Driven</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-200 rounded-full blur-2xl opacity-50"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-yellow-200 rounded-full blur-2xl opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* How it Works Section */}

      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fcf8f5] to-white"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold text-[#f78433] bg-orange-50 px-4 py-2 rounded-full">
                How It Works
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Path to Success in{" "}
              <span className="text-[#f78433]">4 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From application to offer, we've got you covered every step of the
              way
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connection Line - Hidden on mobile */}
            <div
              className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-orange-200 via-orange-300 to-green-300"
              style={{ width: "calc(100% - 12rem)", margin: "0 6rem" }}
            ></div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {/* Step 1: Add Job Applications */}
              <div className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-200">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#f78433] to-[#ff6b35] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    1
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-100 transition-colors">
                    <Plus className="w-8 h-8 text-[#f78433]" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Add Applications
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Quickly add job applications with all the important details
                    - company name, position, salary, and application date.
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-[#f78433] rounded-full mr-2"></div>
                      Quick entry form
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-[#f78433] rounded-full mr-2"></div>
                      Bulk import support
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-[#f78433] rounded-full mr-2"></div>
                      Auto-save drafts
                    </li>
                  </ul>
                </div>

                {/* Arrow - Hidden on mobile and last item */}
                <div className="hidden lg:block absolute top-20 -right-3 text-orange-300">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>

              {/* Step 2: Track Progress */}
              <div className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-200">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    2
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Track Progress
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Monitor every application through each stage - from
                    submitted to interview, offer, and beyond.
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                      Status updates
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                      Interview scheduling
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                      Notes & reminders
                    </li>
                  </ul>
                </div>

                {/* Arrow */}
                <div className="hidden lg:block absolute top-20 -right-3 text-blue-300">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>

              {/* Step 3: Analyze Performance */}
              <div className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-200">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    3
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-100 transition-colors">
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Analyze Performance
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Get insights into your job search with visual analytics,
                    success rates, and trends over time.
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></div>
                      Success metrics
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></div>
                      Response rates
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></div>
                      Time-to-hire stats
                    </li>
                  </ul>
                </div>

                {/* Arrow */}
                <div className="hidden lg:block absolute top-20 -right-3 text-purple-300">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>

              {/* Step 4: Land Your Dream Job */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-green-200 hover:border-green-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    4
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Land Your Dream Job
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Stay organized, motivated, and confident as you navigate
                    offers and make the best decision for your career.
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                      Offer comparison
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                      Decision tracking
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                      Success celebration
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <button className="bg-gradient-to-r from-[#f78433] to-[#ff6b35] text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-lg transform hover:scale-105 inline-flex items-center gap-2">
              Start Tracking Your Applications
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-gray-500 text-sm mt-4">
              Free forever. No credit card required.
            </p>
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
}
