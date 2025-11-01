import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // 🔥 Add key to force re-render when avatar changes
  const [avatarKey, setAvatarKey] = useState(Date.now());

  // 🔥 Update key when user changes
  useEffect(() => {
    if (user?.avatar) {
      setAvatarKey(Date.now());
    }
  }, [user?.avatar]);

  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const toggleDark = () => {
    setDark(!dark);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 flex justify-between items-center p-4 bg-amber-400 shadow-amber-600/40 shadow-md z-50 transition-colors duration-300">
      <Link 
        to="/" 
        className="font-bold text-xl px-4 py-2 rounded-sm dark:bg-gray-800 dark:hover:bg-gray-900 transition-all duration-200"
      >
        <span className="text-white">MCT-Portfolio-Hub</span>
      </Link>
      
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDark}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 text-xl shadow-sm hover:shadow-md transform hover:scale-110"
          aria-label="Toggle dark mode"
          title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {dark ? "☀️" : "🌙"}
        </button>
        
        {user ? (
          <>
            <Link to="/upload">
              <span className="font-bold text-gray-800 hover:text-white hover:bg-gray-800/75 px-4 py-3 rounded-sm duration-200">Upload</span>
            </Link>
            
            {/* 🔥 User Profile with key for re-render */}
            <Link 
              to="/profile" 
              className="flex items-center gap-2 hover:bg-gray-800/75 px-3 py-1 rounded-sm transition-all duration-200"
            >
              {user.avatar ? (
                <img 
                  key={avatarKey} // 🔥 Force re-render on change
                  src={`${user.avatar}?t=${avatarKey}`} // 🔥 Add timestamp to break cache
                  alt={user.username} 
                  className="w-9 h-9 rounded-full object-cover border-2 border-white  shadow-md" 
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-bold text-gray-800 hover:text-white hidden sm:inline">
                {user.username}
              </span>
            </Link>
            
            <button 
              onClick={handleLogout} 
              className="text-red-900 dark:text-red-700 hover:text-white dark:hover:text-white transition-colors hover:bg-red-800/75 px-4 py-2 !rounded-sm duration-200 font-bold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <span className="font-bold text-gray-800 hover:text-white hover:bg-gray-800/75 px-4 py-3 rounded-sm duration-200">Login</span>
            </Link>
            <Link to="/register" className="!bg-white dark:bg-blue-600 !text-gray-800 hover:!text-white px-4 py-2 rounded-sm hover:!bg-gray-800/75 dark:hover:bg-white transition-all duration-200 font-medium">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}