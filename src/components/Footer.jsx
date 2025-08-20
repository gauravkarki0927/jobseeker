import { useEffect } from "react";
import {
  Github,
  Youtube,
  Facebook,
  Mail,
  Phone,
  Send,
  Briefcase,
} from "lucide-react";

export default function Footer() {
  useEffect(() => {
    // Update year dynamically
    const yearSpan = document.getElementById("year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  }, []);

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl animate-float1"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl animate-float2"></div>
        <div className="absolute bottom-10 left-1/2 w-48 h-48 bg-cyan-500 rounded-full filter blur-3xl animate-float3"></div>
      </div>

      {/* Main footer content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {/* Logo/Name section */}
          <div className="group">
            <div className="flex items-center space-x-2 mb-6">
              <Briefcase className="transform group-hover:rotate-12 transition duration-500 h-8 w-8 text-green-500" />
              <h2 className="text-2xl font-bold text-green-500">
                <span className="text-white">Job</span>Seeker
              </h2>
            </div>
            <p className="text-gray-300 mb-6">
              Empowering your career journey with opportunities that matter.
            </p>

            {/* Social media */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:shadow-lg hover:shadow-black-500/30 transition-all duration-300"
              >
                <Github className="w-5 text-black h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300"
              >
                <Youtube className="w-5 text-red-600 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
              >
                <Facebook className="w-5 text-blue-600 h-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="group">
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              <span className="relative z-10">Quick Links</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Jobs', href: '/' },
                { name: 'About Us', href: '/about' },
                { name: 'Companies', href: '/companies' },
                { name: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-green-600 hover:pl-2 transition-all duration-300 flex items-center"
                  >
                    <span className="w-1 h-1 bg-gren-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}

            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center animate-pulse">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-300">Email</p>
                  <a
                    href="mailto:support@jobseeker.com"
                    className="text-white hover:text-green-600 transition"
                  >
                    support@jobseeker.com
                  </a>
                </div>
              </li>

              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center animate-pulse [animation-delay:0.2s]">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-300">Phone</p>
                  <a
                    href="tel:+9779812345678"
                    className="text-white hover:text-green-600 transition"
                  >
                    +977 9812345678
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter and never miss a new job.
            </p>
            <form className="mt-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full bg-gray-800 border border-gray-700 rounded-[2px] py-3 px-4 outline-none focus:border-green-600 placeholder-gray-100 text-white"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white rounded-[4px] px-4 py-1 transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; <span id="year" className="text-blue-400"></span> JobSeeker.
            All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
