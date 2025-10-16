import {
  Briefcase,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Heart,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#fcf8f5] to-[#f5e6dc]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#f78433] to-[#ff6b35] rounded-lg flex items-center justify-center shadow-md">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#f78433] to-[#ff6b35] bg-clip-text text-transparent">
                Job Trackr
              </span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              Your personal job search companion. Built with passion in South
              Africa 🇿🇦 to help you land your dream job.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-[#f78433] transition-colors group shadow-sm"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-[#f78433] transition-colors group shadow-sm"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-[#f78433] transition-colors group shadow-sm"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-gray-600 hover:text-[#f78433] transition-colors inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#f78433] mr-0 group-hover:mr-2 transition-all"></span>
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-gray-600 hover:text-[#f78433] transition-colors inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#f78433] mr-0 group-hover:mr-2 transition-all"></span>
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-600 hover:text-[#f78433] transition-colors inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#f78433] mr-0 group-hover:mr-2 transition-all"></span>
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-600 hover:text-[#f78433] transition-colors inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#f78433] mr-0 group-hover:mr-2 transition-all"></span>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#f78433] transition-colors inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#f78433] mr-0 group-hover:mr-2 transition-all"></span>
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#f78433] transition-colors inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#f78433] mr-0 group-hover:mr-2 transition-all"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#f78433] transition-colors inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#f78433] mr-0 group-hover:mr-2 transition-all"></span>
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#f78433] transition-colors inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#f78433] mr-0 group-hover:mr-2 transition-all"></span>
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-orange-200">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Stay Updated
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Get tips and updates on your job search journey.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f78433] focus:border-transparent shadow-sm"
                />
              </div>
              <button className="bg-gradient-to-r from-[#f78433] to-[#ff6b35] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm text-center md:text-left">
              © {currentYear} Job Trackr. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm flex items-center gap-2">
              Made with{" "}
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />{" "}
              by a developer in South Africa
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
