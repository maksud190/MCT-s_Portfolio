// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
  
//   // 🔥 Add key to force re-render when avatar changes
//   const [avatarKey, setAvatarKey] = useState(Date.now());

//   // 🔥 Update key when user changes
//   useEffect(() => {
//     if (user?.avatar) {
//       setAvatarKey(Date.now());
//     }
//   }, [user?.avatar]);

//   const [dark, setDark] = useState(() => {
//     const savedTheme = localStorage.getItem("theme");
//     if (savedTheme) {
//       return savedTheme === "dark";
//     }
//     return window.matchMedia("(prefers-color-scheme: dark)").matches;
//   });

//   useEffect(() => {
//     if (dark) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [dark]);

//   const toggleDark = () => {
//     setDark(!dark);
//   };

//   const handleLogout = () => {
//     logout();
//     toast.success("Logged out successfully!");
//     navigate("/login");
//   };

//   return (
//     <nav className="sticky top-0 flex justify-between items-center p-4 bg-amber-400 shadow-amber-600/40 shadow-md z-50 transition-colors duration-300">
//       <Link 
//         to="/" 
//         className="font-bold text-xl px-4 py-2 rounded-sm dark:bg-gray-800 dark:hover:bg-gray-900 transition-all duration-200"
//       >
//         <span className="text-white">MCT-Portfolio-Hub</span>
//       </Link>
      
//       <div className="flex items-center gap-3">
//         <button
//           onClick={toggleDark}
//           className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 text-xl shadow-sm hover:shadow-md transform hover:scale-110"
//           aria-label="Toggle dark mode"
//           title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
//         >
//           {dark ? "☀️" : "🌙"}
//         </button>
        
//         {user ? (
//           <>
//             <Link to="/upload">
//               <span className="font-bold text-gray-800 hover:text-white hover:bg-gray-800/75 px-4 py-3 rounded-sm duration-200">Upload</span>
//             </Link>
            
//             {/* 🔥 User Profile with key for re-render */}
//             <Link 
//               to="/profile" 
//               className="flex items-center gap-2 hover:bg-gray-800/75 px-3 py-1 rounded-sm transition-all duration-200"
//             >
//               {user.avatar ? (
//                 <img 
//                   key={avatarKey} // 🔥 Force re-render on change
//                   src={`${user.avatar}?t=${avatarKey}`} // 🔥 Add timestamp to break cache
//                   alt={user.username} 
//                   className="w-9 h-9 rounded-full object-cover border-2 border-white  shadow-md" 
//                 />
//               ) : (
//                 <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
//                   {user.username?.charAt(0).toUpperCase()}
//                 </div>
//               )}
//               <span className="font-bold text-gray-800 hover:text-white hidden sm:inline">
//                 {user.username}
//               </span>
//             </Link>
            
//             <button 
//               onClick={handleLogout} 
//               className="text-red-900 dark:text-red-700 hover:text-white dark:hover:text-white transition-colors hover:bg-red-800/75 px-4 py-2 !rounded-sm duration-200 font-bold"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link to="/login">
//               <span className="font-bold text-gray-800 hover:text-white hover:bg-gray-800/75 px-4 py-3 rounded-sm duration-200">Login</span>
//             </Link>
//             <Link to="/register" className="!bg-white dark:bg-blue-600 !text-gray-800 hover:!text-white px-4 py-2 rounded-sm hover:!bg-gray-800/75 dark:hover:bg-white transition-all duration-200 font-medium">
//               Register
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }









// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useState } from "react";
// import SearchBar from "./SearchBar";
// import NotificationBell from "./NotificationBell";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [darkMode, setDarkMode] = useState(
//     localStorage.getItem("theme") === "dark"
//   );
//   const [showMobileMenu, setShowMobileMenu] = useState(false);

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     if (newMode) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//     setShowMobileMenu(false);
//   };

//   return (
//     <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link
//             to="/"
//             className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
//           >
//             <span className="text-2xl">🎨</span>
//             <span className="hidden sm:inline">MCT Portfolio Hub</span>
//             <span className="sm:hidden">MCT</span>
//           </Link>

//           {/* Desktop Search Bar */}
//           <div className="hidden md:block flex-1 max-w-xl mx-8">
//             <SearchBar />
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center gap-4">
//             {/* Dark Mode Toggle */}
//             <button
//               onClick={toggleDarkMode}
//               className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
//               aria-label="Toggle dark mode"
//             >
//               {darkMode ? (
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
//                 </svg>
//               ) : (
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
//                 </svg>
//               )}
//             </button>

//             {user ? (
//               <>
//                 {/* Notification Bell */}
//                 <NotificationBell />

//                 {/* Upload Button */}
//                 <Link
//                   to="/upload"
//                   className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors"
//                 >
//                   Upload
//                 </Link>

//                 {/* User Avatar Dropdown */}
//                 <div className="relative group">
//                   <button className="flex items-center gap-2">
//                     {user.avatar ? (
//                       <img
//                         src={user.avatar}
//                         alt={user.username}
//                         className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-amber-400 transition-all"
//                       />
//                     ) : (
//                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold border-2 border-transparent group-hover:border-amber-600 transition-all">
//                         {user.username?.charAt(0).toUpperCase()}
//                       </div>
//                     )}
//                   </button>

//                   {/* Dropdown Menu */}
//                   <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200 dark:border-gray-700">
//                     <div className="py-2">
//                       <Link
//                         to="/profile"
//                         className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                       >
//                         👤 My Profile
//                       </Link>
//                       <Link
//                         to="/settings"
//                         className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                       >
//                         ⚙️ Settings
//                       </Link>
//                       {user.role === "admin" && (
//                         <Link
//                           to="/admin"
//                           className="block px-4 py-2 text-amber-600 dark:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
//                         >
//                           🛡️ Admin Panel
//                         </Link>
//                       )}
//                       <hr className="my-2 border-gray-200 dark:border-gray-700" />
//                       <button
//                         onClick={handleLogout}
//                         className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                       >
//                         🚪 Logout
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <Link
//                   to="/login"
//                   className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 font-medium transition-colors"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setShowMobileMenu(!showMobileMenu)}
//             className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               {showMobileMenu ? (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               ) : (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               )}
//             </svg>
//           </button>
//         </div>

//         {/* Mobile Search Bar */}
//         <div className="md:hidden pb-3">
//           <SearchBar />
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {showMobileMenu && (
//         <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
//           <div className="px-4 py-3 space-y-3">
//             <button
//               onClick={toggleDarkMode}
//               className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//             >
//               {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
//             </button>

//             {user ? (
//               <>
//                 <Link
//                   to="/profile"
//                   onClick={() => setShowMobileMenu(false)}
//                   className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   👤 My Profile
//                 </Link>
//                 <Link
//                   to="/upload"
//                   onClick={() => setShowMobileMenu(false)}
//                   className="block px-4 py-2 bg-amber-400 text-white text-center rounded-lg font-medium hover:bg-amber-500 transition-colors"
//                 >
//                   Upload Project
//                 </Link>
//                 <Link
//                   to="/settings"
//                   onClick={() => setShowMobileMenu(false)}
//                   className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   ⚙️ Settings
//                 </Link>
//                 {user.role === "admin" && (
//                   <Link
//                     to="/admin"
//                     onClick={() => setShowMobileMenu(false)}
//                     className="block px-4 py-2 text-amber-600 dark:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-semibold transition-colors"
//                   >
//                     🛡️ Admin Panel
//                   </Link>
//                 )}
//                 <button
//                   onClick={handleLogout}
//                   className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   🚪 Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link
//                   to="/login"
//                   onClick={() => setShowMobileMenu(false)}
//                   className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   onClick={() => setShowMobileMenu(false)}
//                   className="block px-4 py-2 bg-amber-400 text-white text-center rounded-lg font-medium hover:bg-amber-500 transition-colors"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }










import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Avatar key for re-render
  const [avatarKey, setAvatarKey] = useState(Date.now());

  // Update key when user avatar changes
  useEffect(() => {
    if (user?.avatar) {
      setAvatarKey(Date.now());
    }
  }, [user?.avatar]);

  // Dark mode state
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Mobile menu state
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
    setShowMobileMenu(false);
  };

  return (
    <nav className="sticky top-0 bg-amber-400 shadow-amber-600/40 shadow-md z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="font-bold text-xl px-4 py-2 rounded-sm dark:bg-gray-800 dark:hover:bg-gray-900 transition-all duration-200"
          >
            <span className="text-white">MCT-Portfolio-Hub</span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark Mode Toggle */}
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
                {/* Notification Bell */}
                <NotificationBell />

                {/* Upload Button */}
                <Link to="/upload">
                  <span className="font-bold text-gray-800 hover:text-white hover:bg-gray-800/75 px-4 py-3 rounded-sm duration-200">
                    Upload
                  </span>
                </Link>
                
                {/* User Profile Dropdown */}
                <div className="relative group">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 hover:bg-gray-800/75 px-3 py-1 rounded-sm transition-all duration-200"
                  >
                    {user.avatar ? (
                      <img 
                        key={avatarKey}
                        src={`${user.avatar}?t=${avatarKey}`}
                        alt={user.username} 
                        className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md" 
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-bold text-gray-800 hover:text-white">
                      {user.username}
                    </span>
                  </Link>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200 dark:border-gray-700">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        👤 My Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        ⚙️ Settings
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-amber-600 dark:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
                        >
                          🛡️ Admin Panel
                        </Link>
                      )}
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-bold"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <span className="font-bold text-gray-800 hover:text-white hover:bg-gray-800/75 px-4 py-3 rounded-sm duration-200">
                    Login
                  </span>
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white dark:bg-blue-600 text-gray-800 hover:text-white px-4 py-2 rounded-sm hover:bg-gray-800/75 dark:hover:bg-white transition-all duration-200 font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-white hover:text-gray-800 hover:bg-white/20 rounded-sm transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-amber-300 dark:bg-gray-800 border-t border-amber-500 dark:border-gray-700">
          <div className="px-4 py-3 space-y-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-300 hover:bg-amber-200 dark:hover:bg-gray-700 rounded-sm transition-colors font-medium"
            >
              {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 px-4 py-2 bg-amber-200 dark:bg-gray-700 rounded-sm">
                  {user.avatar ? (
                    <img 
                      src={`${user.avatar}?t=${avatarKey}`}
                      alt={user.username} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-bold text-gray-800 dark:text-white">
                    {user.username}
                  </span>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-gray-800 dark:text-gray-300 hover:bg-amber-200 dark:hover:bg-gray-700 rounded-sm transition-colors font-medium"
                >
                  👤 My Profile
                </Link>
                <Link
                  to="/upload"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 bg-white dark:bg-blue-600 text-gray-800 dark:text-white text-center rounded-sm font-bold hover:bg-gray-800 hover:text-white dark:hover:bg-blue-700 transition-colors"
                >
                  📤 Upload Project
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-gray-800 dark:text-gray-300 hover:bg-amber-200 dark:hover:bg-gray-700 rounded-sm transition-colors font-medium"
                >
                  ⚙️ Settings
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2 bg-amber-500 dark:bg-amber-600 text-white hover:bg-amber-600 dark:hover:bg-amber-700 rounded-sm font-bold transition-colors"
                  >
                    🛡️ Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-900 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-sm transition-colors font-bold"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-gray-800 dark:text-gray-300 hover:bg-amber-200 dark:hover:bg-gray-700 rounded-sm transition-colors font-medium"
                >
                  🔐 Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 bg-white dark:bg-blue-600 text-gray-800 dark:text-white text-center rounded-sm font-bold hover:bg-gray-800 hover:text-white dark:hover:bg-blue-700 transition-colors"
                >
                  📝 Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}