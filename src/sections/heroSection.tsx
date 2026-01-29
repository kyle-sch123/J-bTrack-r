// import React from "react";
// import { ArrowRight } from "lucide-react";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// export default function HeroSection() {
//   return (
//     <section className="py-15 px-4 sm:px-6 lg:px-8 bg-white flex align-middle justify-center">
//       <div className="container mx-8 max-w-7xl">
//         <div className="grid md:grid-cols-2 items-center">
//           {/* Text Column */}
//           <div className="space-y-6">
//             <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
//               Track Your J<span className="text-[#f78433]">*</span>b
//               Applications <span className="text-[#f78433]">Effortlessly</span>
//             </h1>
//             <p className="text-lg md:text-xl text-black/60 leading-relaxed">
//               Stay organized and never miss an opportunity. Manage all your j*b
//               applications, interviews, and follow-ups in one intuitive
//               platform.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 pt-4">
//               <button className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-black/90 transition-colors flex items-center justify-center gap-2">
//                 Get Started Free
//                 <ArrowRight size={20} />
//               </button>
//               <button className="border-2 border-black/20 text-black/80 px-6 py-3 rounded-md font-semibold hover:bg-black/5 transition-colors">
//                 Watch Demo
//               </button>
//             </div>
//             <div className="flex items-center gap-8 pt-5 text-sm text-black/60">
//               <div>
//                 <div className="text-2xl font-bold text-gray-900">10k+</div>
//                 <div>Active Users</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-gray-900">50k+</div>
//                 <div>J*bs Tracked</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-gray-900">4.9★</div>
//                 <div>User Rating</div>
//               </div>
//             </div>
//           </div>

//           {/* Lottie Animation Column */}
//           <div className="flex items-center justify-center">
//             <DotLottieReact
//               //   src="@/assets/animations/animation.lottie"
//               src="https://lottie.host/b745e17c-b986-4095-b7e4-0368ef0ecb0b/MZ3JlIFG7j.lottie"
//               loop
//               autoplay
//               speed={0.3}
//               className="w-auto h-[400px] md:h-[550px]"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
import React from "react";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function HeroSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-[#fffaf5] via-[#fff7ed] to-[#fef3e8]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-yellow-200/15 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Column */}
          <div className="space-y-8 animate-slide-in-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200/50 shadow-sm">
              <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                South Africa's #1 Job Tracker
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Track Your{" "}
              <span className="relative inline-block">
                <span className="relative z-10">J*b</span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-orange-300/40 -rotate-1"></span>
              </span>
              <br />
              Applications
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent animate-gradient">
                Effortlessly
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light max-w-xl">
              Stop juggling spreadsheets. Manage applications, track interviews,
              and land your dream role—all in one beautifully simple platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button className="group relative bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative flex items-center gap-3">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button className="group border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-3">
                <Zap className="w-5 h-5 group-hover:text-yellow-400 transition-colors" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 animate-fade-in-up">
              <div className="group">
                <div className="text-4xl font-black text-gray-900 group-hover:text-orange-500 transition-colors">
                  10k+
                </div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Active Users
                </div>
              </div>
              <div className="group">
                <div className="text-4xl font-black text-gray-900 group-hover:text-orange-500 transition-colors">
                  50k+
                </div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  J*bs Tracked
                </div>
              </div>
              <div className="group">
                <div className="text-4xl font-black text-gray-900 group-hover:text-orange-500 transition-colors flex items-center gap-1">
                  4.9
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  User Rating
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-4 pt-4 text-sm text-gray-600">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 border-2 border-white flex items-center justify-center text-white font-bold text-xs"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="font-medium">
                Trusted by job seekers across South Africa
              </span>
            </div>
          </div>

          {/* Animation Column */}
          <div className="relative animate-slide-in-right">
            {/* Decorative elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl rotate-12 opacity-20 blur-xl animate-pulse-slow"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full opacity-20 blur-2xl animate-float"></div>

            {/* Main animation container */}
            <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-orange-200/50">
              <DotLottieReact
                src="https://lottie.host/b745e17c-b986-4095-b7e4-0368ef0ecb0b/MZ3JlIFG7j.lottie"
                loop
                autoplay
                speed={0.3}
                className="w-full h-[400px] md:h-[500px]"
              />

              {/* Floating cards */}
              <div className="absolute -left-4 top-20 bg-white rounded-xl shadow-xl p-4 animate-float border border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">✓</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">
                      Application
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      Accepted!
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-20 bg-white rounded-xl shadow-xl p-4 animate-float-delayed border border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📅</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">
                      Interview
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      Tomorrow
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
          animation-delay: 0.4s;
          animation-fill-mode: both;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}
