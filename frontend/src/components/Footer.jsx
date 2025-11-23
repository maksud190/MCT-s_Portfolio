import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API } from "../api/api";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // ✅ Dynamic stats state
  const [stats, setStats] = useState({
    projects: 0,
    users: 0
  });

  // ✅ Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, usersRes] = await Promise.all([
        API.get("/projects"),
        API.get("/users/all")
      ]);

      setStats({
        projects: projectsRes.data.length || 0,
        users: usersRes.data.length || 0
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 relative">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              MCT's Portfolio
            </h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              A platform for Multimedia & Creative Technology students to showcase their creative works, connect with peers, and build their professional portfolio.
            </p>
            <div className="">
              <a 
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className=""
                aria-label="Facebook"
              >
                <span></span>
                <span className="text-lg">Facebook</span>
              </a>
              <br />
              <a 
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className=""
                aria-label="Twitter"
              >
                <span className="text-lg">Website</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/"
                  className="text-sm hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span>🏠</span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/upload"
                  className="text-sm hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span>⬆️</span>
                  <span>Upload Project</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-sm hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span>👤</span>
                  <span>My Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="text-sm hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span>⚙️</span>
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/?category=3d"
                  className="text-sm hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span>🎲</span>
                  <span>3D Modeling</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Graphics Design"
                  className="text-sm hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span>🎨</span>
                  <span>Graphics Design</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Web Development"
                  className="text-sm hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span>💻</span>
                  <span>Web Development</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Video Production"
                  className="text-sm hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span>🎬</span>
                  <span>Video Production</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Photography"
                  className="text-sm hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span>📸</span>
                  <span>Photography</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2.5 mb-6">
              <li>
                <a 
                  href="#"
                  className="text-sm hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span>📚</span>
                  <span>Guidelines</span>
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-sm hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span>❓</span>
                  <span>FAQ</span>
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-sm hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span>📧</span>
                  <span>Contact Support</span>
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-sm hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span>🔒</span>
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-sm hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span>📜</span>
                  <span>Terms of Service</span>
                </a>
              </li>
            </ul>

            {/* Contact Info */}
            <div className="bg-stone-800/50 p-4 rounded-sm">
              <p className="text-xs text-gray-400 mb-2 font-semibold">Contact Us</p>
              <a 
                href="mailto:support@mctportfolio.com"
                className="text-sm !text-blue-400 hover:!text-blue-600 transition-colors block mb-1"
              >
                support@mctportfolio.com
              </a>
              <a 
                href="mailto:support@mctportfolio.com"
                className="text-sm !text-blue-400 hover:!text-blue-600 transition-colors block mb-1"
              >
                support@mctportfolio.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-stone-400 text-center md:text-left">
              © {currentYear} MCT's Portfolio. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <span>💡</span>
                <span>Made with passion by MCT students</span>
              </span>
              <span className="hidden md:block">•</span>
              <span className="flex items-center gap-1">
                <span>🚀</span>
                <span>Powered by creativity</span>
              </span>
            </div>

            {/* ✅ Dynamic Stats */}
            <div className="flex gap-4 text-xs">
              <div className="bg-stone-800 px-3 py-1.5 rounded-sm">
                <span className="text-stone-500">Projects:</span>
                <span className="text-blue-400 ml-1 font-semibold">
                  {stats.projects}+
                </span>
              </div>
              <div className="bg-stone-800 px-3 py-1.5 rounded-sm">
                <span className="text-stone-500">Users:</span>
                <span className="text-blue-400 ml-1 font-semibold">
                  {stats.users}+
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-stone-800 hover:bg-stone-900 text-white w-14 h-14 !rounded-sm shadow-lg flex items-center justify-center transition-all hover:scale-110"
        aria-label="Back to top"
      >
        <span className="text-2xl">👆🏻</span>
      </button>
    </footer>
  );
}