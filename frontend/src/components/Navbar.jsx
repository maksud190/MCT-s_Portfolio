import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast"; // 🔥 Import

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // 🔥 Initial dark mode check করা - localStorage এবং system preference থেকে
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // 🔥 Component mount হওয়ার সময় dark class apply করা
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // 🔥 Toggle function - state এবং DOM উভয় update করা
  const toggleDark = () => {
    setDark(!dark); // সহজভাবে toggle করা
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 flex justify-between items-center p-4 bg-amber-400 shadow-md z-50 transition-colors duration-300">
      <Link 
        to="/" 
        className="font-bold text-xl px-4 py-2 rounded-sm dark:bg-gray-800 dark:hover:bg-gray-900 transition-all duration-200"
      >
        <span className="text-white">MCT-Portfolio-Hub</span>
      </Link>
      
      <div className="flex items-center gap-2">
        {/* 🔥 Dark mode toggle button with smooth animation */}
        <button
          onClick={toggleDark}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 text-xl shadow-sm hover:shadow-md transform hover:scale-110"
          aria-label="Toggle dark mode"
          title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {dark ? "☀️" : "🌙"}
        </button>
        
        {user ? (
          <>
            <Link 
              to="/upload"
              className=" transition-colors font-medium"
            >
              <span className="font-bold text-gray-800 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-sm duration-200">Upload</span>
            </Link>
            <Link 
              to="/profile"
            >
              <span className="font-bold text-gray-800 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-sm duration-200">
                {user.username}
              </span>
              
            </Link>
            <button 
              onClick={handleLogout} 
              className=" text-red-900 dark:text-red-700 hover:text-red-700 dark:hover:text-red-900 transition-colors duration-200 font-bold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Login
            </Link>
            <Link 
              to="/register"
              className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}


