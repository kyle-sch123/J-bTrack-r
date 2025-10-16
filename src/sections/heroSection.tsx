import React from "react";
import { ArrowRight } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function HeroSection() {
  return (
    <section className="py-15 px-4 sm:px-6 lg:px-8 bg-white flex align-middle justify-center">
      <div className="container mx-8 max-w-7xl">
        <div className="grid md:grid-cols-2 items-center">
          {/* Text Column */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Track Your J<span className="text-[#f78433]">*</span>b
              Applications <span className="text-[#f78433]">Effortlessly</span>
            </h1>
            <p className="text-lg md:text-xl text-black/60 leading-relaxed">
              Stay organized and never miss an opportunity. Manage all your job
              applications, interviews, and follow-ups in one intuitive
              platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-black/90 transition-colors flex items-center justify-center gap-2">
                Get Started Free
                <ArrowRight size={20} />
              </button>
              <button className="border-2 border-black/20 text-black/80 px-6 py-3 rounded-md font-semibold hover:bg-black/5 transition-colors">
                Watch Demo
              </button>
            </div>
            <div className="flex items-center gap-8 pt-5 text-sm text-black/60">
              <div>
                <div className="text-2xl font-bold text-gray-900">10k+</div>
                <div>Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">50k+</div>
                <div>Jobs Tracked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">4.9★</div>
                <div>User Rating</div>
              </div>
            </div>
          </div>

          {/* Lottie Animation Column */}
          <div className="flex items-center justify-center">
            <DotLottieReact
              //   src="@/assets/animations/animation.lottie"
              src="https://lottie.host/b745e17c-b986-4095-b7e4-0368ef0ecb0b/MZ3JlIFG7j.lottie"
              loop
              autoplay
              speed={0.3}
              className="w-auto h-[400px] md:h-[550px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
