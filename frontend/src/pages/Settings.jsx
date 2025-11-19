// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { API } from "../api/api";
// import toast from "react-hot-toast";

// export default function Settings() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState("account");
//   const [loading, setLoading] = useState(false);

//   // Account Settings
//   const [accountData, setAccountData] = useState({
//     username: "",
//     email: "",
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   // Profile Settings
//   const [profileData, setProfileData] = useState({
//     bio: "",
//     isAvailableForHire: false,
//     hourlyRate: "",
//   });

//   // Social Links
//   const [socialLinks, setSocialLinks] = useState({
//     linkedin: "",
//     github: "",
//     behance: "",
//     portfolio: "",
//     twitter: "",
//     instagram: "",
//     facebook: "",
//   });

//   // Privacy Settings
//   const [privacySettings, setPrivacySettings] = useState({
//     showEmail: false,
//     showProjects: true,
//     allowComments: true,
//     allowMessages: true,
//   });

//   // Notification Settings
//   const [notificationSettings, setNotificationSettings] = useState({
//     emailNotifications: true,
//     likeNotifications: true,
//     commentNotifications: true,
//     followNotifications: true,
//   });

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     // Load user data
//     setAccountData({
//       username: user.username || "",
//       email: user.email || "",
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     });

//     setProfileData({
//       bio: user.bio || "",
//       isAvailableForHire: user.isAvailableForHire || false,
//       hourlyRate: user.hourlyRate || "",
//     });

//     setSocialLinks(user.socialLinks || {
//       linkedin: "",
//       github: "",
//       behance: "",
//       portfolio: "",
//       twitter: "",
//       instagram: "",
//       facebook: "",
//     });
//   }, [user, navigate]);

//   // Update Account
//   const handleUpdateAccount = async (e) => {
//     e.preventDefault();

//     if (accountData.newPassword && accountData.newPassword !== accountData.confirmPassword) {
//       toast.error("Passwords don't match!");
//       return;
//     }

//     if (accountData.newPassword && accountData.newPassword.length < 6) {
//       toast.error("Password must be at least 6 characters");
//       return;
//     }

//     setLoading(true);
//     const loadingToast = toast.loading("Updating account...");

//     try {
//       const token = localStorage.getItem("token");
//       const updateData = {
//         username: accountData.username,
//       };

//       if (accountData.newPassword) {
//         updateData.currentPassword = accountData.currentPassword;
//         updateData.newPassword = accountData.newPassword;
//       }

//       await API.put("/users/account", updateData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("Account updated successfully!", { id: loadingToast });
      
//       // Clear password fields
//       setAccountData({
//         ...accountData,
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//     } catch (err) {
//       console.error("Update account error:", err);
//       toast.error(err.response?.data?.message || "Failed to update account", {
//         id: loadingToast,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update Profile
//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const loadingToast = toast.loading("Updating profile...");

//     try {
//       const token = localStorage.getItem("token");
      
//       await API.put("/users/profile", profileData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("Profile updated successfully!", { id: loadingToast });
//     } catch (err) {
//       console.error("Update profile error:", err);
//       toast.error(err.response?.data?.message || "Failed to update profile", {
//         id: loadingToast,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update Social Links
//   const handleUpdateSocialLinks = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const loadingToast = toast.loading("Updating social links...");

//     try {
//       const token = localStorage.getItem("token");
      
//       await API.put("/users/social-links", { socialLinks }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("Social links updated successfully!", { id: loadingToast });
//     } catch (err) {
//       console.error("Update social links error:", err);
//       toast.error(err.response?.data?.message || "Failed to update social links", {
//         id: loadingToast,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete Account
//   const handleDeleteAccount = async () => {
//     const confirmed = window.confirm(
//       "⚠️ WARNING: This will permanently delete your account and all your projects!\n\nType 'DELETE' to confirm:"
//     );

//     if (!confirmed) return;

//     const userInput = prompt("Type 'DELETE' to confirm:");
//     if (userInput !== "DELETE") {
//       toast.error("Account deletion cancelled");
//       return;
//     }

//     setLoading(true);
//     const loadingToast = toast.loading("Deleting account...");

//     try {
//       const token = localStorage.getItem("token");
      
//       await API.delete("/users/account", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("Account deleted successfully", { id: loadingToast });
//       logout();
//       navigate("/");
//     } catch (err) {
//       console.error("Delete account error:", err);
//       toast.error(err.response?.data?.message || "Failed to delete account", {
//         id: loadingToast,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
//         {/* Header */}
//         <div className="border-b border-gray-200 dark:border-gray-700 p-6">
//           <div className="flex items-center justify-between">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//               Settings
//             </h1>
//             <button
//               onClick={() => navigate("/profile")}
//               className="text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-colors"
//             >
//               ← Back to Profile
//             </button>
//           </div>
//         </div>

//         <div className="flex flex-col md:flex-row">
//           {/* Sidebar Tabs */}
//           <div className="md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-6">
//             <nav className="space-y-2">
//               <button
//                 onClick={() => setActiveTab("account")}
//                 className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                   activeTab === "account"
//                     ? "bg-amber-400 text-white"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 }`}
//               >
//                 👤 Account
//               </button>
//               <button
//                 onClick={() => setActiveTab("profile")}
//                 className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                   activeTab === "profile"
//                     ? "bg-amber-400 text-white"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 }`}
//               >
//                 📝 Profile
//               </button>
//               <button
//                 onClick={() => setActiveTab("social")}
//                 className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                   activeTab === "social"
//                     ? "bg-amber-400 text-white"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 }`}
//               >
//                 🔗 Social Links
//               </button>
//               <button
//                 onClick={() => setActiveTab("privacy")}
//                 className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                   activeTab === "privacy"
//                     ? "bg-amber-400 text-white"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 }`}
//               >
//                 🔒 Privacy
//               </button>
//               <button
//                 onClick={() => setActiveTab("notifications")}
//                 className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                   activeTab === "notifications"
//                     ? "bg-amber-400 text-white"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 }`}
//               >
//                 🔔 Notifications
//               </button>
//               <button
//                 onClick={() => setActiveTab("danger")}
//                 className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                   activeTab === "danger"
//                     ? "bg-red-500 text-white"
//                     : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
//                 }`}
//               >
//                 ⚠️ Danger Zone
//               </button>
//             </nav>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1 p-6">
//             {/* Account Tab */}
//             {activeTab === "account" && (
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//                   Account Settings
//                 </h2>
//                 <form onSubmit={handleUpdateAccount} className="space-y-4">
//                   {/* Username */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Username
//                     </label>
//                     <input
//                       type="text"
//                       value={accountData.username}
//                       onChange={(e) =>
//                         setAccountData({ ...accountData, username: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                       required
//                       disabled={loading}
//                     />
//                   </div>

//                   {/* Email (Read-only) */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       value={accountData.email}
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
//                       disabled
//                     />
//                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                       Email cannot be changed
//                     </p>
//                   </div>

//                   {/* Change Password Section */}
//                   <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                       Change Password
//                     </h3>

//                     <div className="space-y-4">
//                       {/* Current Password */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Current Password
//                         </label>
//                         <input
//                           type="password"
//                           value={accountData.currentPassword}
//                           onChange={(e) =>
//                             setAccountData({
//                               ...accountData,
//                               currentPassword: e.target.value,
//                             })
//                           }
//                           className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                           disabled={loading}
//                           placeholder="Enter current password"
//                         />
//                       </div>

//                       {/* New Password */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           New Password
//                         </label>
//                         <input
//                           type="password"
//                           value={accountData.newPassword}
//                           onChange={(e) =>
//                             setAccountData({
//                               ...accountData,
//                               newPassword: e.target.value,
//                             })
//                           }
//                           className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                           disabled={loading}
//                           placeholder="Enter new password (min 6 characters)"
//                           minLength={6}
//                         />
//                       </div>

//                       {/* Confirm Password */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Confirm New Password
//                         </label>
//                         <input
//                           type="password"
//                           value={accountData.confirmPassword}
//                           onChange={(e) =>
//                             setAccountData({
//                               ...accountData,
//                               confirmPassword: e.target.value,
//                             })
//                           }
//                           className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                           disabled={loading}
//                           placeholder="Confirm new password"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                   >
//                     {loading ? "Saving..." : "Save Changes"}
//                   </button>
//                 </form>
//               </div>
//             )}

//             {/* Profile Tab */}
//             {activeTab === "profile" && (
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//                   Profile Settings
//                 </h2>
//                 <form onSubmit={handleUpdateProfile} className="space-y-4">
//                   {/* Bio */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Bio
//                     </label>
//                     <textarea
//                       value={profileData.bio}
//                       onChange={(e) =>
//                         setProfileData({ ...profileData, bio: e.target.value })
//                       }
//                       rows="4"
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400 resize-none"
//                       disabled={loading}
//                       placeholder="Tell us about yourself..."
//                     />
//                   </div>

//                   {/* Available for Hire */}
//                   <div className="flex items-center gap-3">
//                     <input
//                       type="checkbox"
//                       id="availableForHire"
//                       checked={profileData.isAvailableForHire}
//                       onChange={(e) =>
//                         setProfileData({
//                           ...profileData,
//                           isAvailableForHire: e.target.checked,
//                         })
//                       }
//                       className="w-5 h-5 text-amber-400 border-gray-300 dark:border-gray-600 rounded focus:ring-amber-400"
//                       disabled={loading}
//                     />
//                     <label
//                       htmlFor="availableForHire"
//                       className="text-sm font-medium text-gray-700 dark:text-gray-300"
//                     >
//                       I'm available for hire
//                     </label>
//                   </div>

//                   {/* Hourly Rate */}
//                   {profileData.isAvailableForHire && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         Hourly Rate (Optional)
//                       </label>
//                       <input
//                         type="text"
//                         value={profileData.hourlyRate}
//                         onChange={(e) =>
//                           setProfileData({
//                             ...profileData,
//                             hourlyRate: e.target.value,
//                           })
//                         }
//                         className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                         disabled={loading}
//                         placeholder="e.g. $50/hr"
//                       />
//                     </div>
//                   )}

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                   >
//                     {loading ? "Saving..." : "Save Changes"}
//                   </button>
//                 </form>
//               </div>
//             )}

//             {/* Social Links Tab */}
//             {activeTab === "social" && (
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//                   Social Links
//                 </h2>
//                 <form onSubmit={handleUpdateSocialLinks} className="space-y-4">
//                   {/* LinkedIn */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       🔗 LinkedIn
//                     </label>
//                     <input
//                       type="url"
//                       value={socialLinks.linkedin}
//                       onChange={(e) =>
//                         setSocialLinks({ ...socialLinks, linkedin: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                       disabled={loading}
//                       placeholder="https://linkedin.com/in/username"
//                     />
//                   </div>

//                   {/* GitHub */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       💻 GitHub
//                     </label>
//                     <input
//                       type="url"
//                       value={socialLinks.github}
//                       onChange={(e) =>
//                         setSocialLinks({ ...socialLinks, github: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                       disabled={loading}
//                       placeholder="https://github.com/username"
//                     />
//                   </div>

//                   {/* Behance */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       🎨 Behance
//                     </label>
//                     <input
//                       type="url"
//                       value={socialLinks.behance}
//                       onChange={(e) =>
//                         setSocialLinks({ ...socialLinks, behance: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                       disabled={loading}
//                       placeholder="https://behance.net/username"
//                     />
//                   </div>

//                   {/* Portfolio */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       🌐 Portfolio Website
//                     </label>
//                     <input
//                       type="url"
//                       value={socialLinks.portfolio}
//                       onChange={(e) =>
//                         setSocialLinks({ ...socialLinks, portfolio: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                       disabled={loading}
//                       placeholder="https://yourportfolio.com"
//                     />
//                   </div>

//                   {/* Twitter */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       🐦 Twitter
//                     </label>
//                     <input
//                       type="url"
//                       value={socialLinks.twitter}
//                       onChange={(e) =>
//                         setSocialLinks({ ...socialLinks, twitter: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                       disabled={loading}
//                       placeholder="https://twitter.com/username"
//                     />
//                   </div>

//                   {/* Instagram */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       📷 Instagram
//                     </label>
//                     <input
//                       type="url"
//                       value={socialLinks.instagram}
//                       onChange={(e) =>
//                         setSocialLinks({ ...socialLinks, instagram: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                       disabled={loading}
//                       placeholder="https://instagram.com/username"
//                     />
//                   </div>

//                   {/* Facebook */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       📘 Facebook
//                     </label>
//                     <input
//                       type="url"
//                       value={socialLinks.facebook}
//                       onChange={(e) =>
//                         setSocialLinks({ ...socialLinks, facebook: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                       disabled={loading}
//                       placeholder="https://facebook.com/username"
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                   >
//                     {loading ? "Saving..." : "Save Social Links"}
//                   </button>
//                 </form>
//               </div>
//             )}

//             {/* Privacy Tab */}
//             {activeTab === "privacy" && (
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//                   Privacy Settings
//                 </h2>
//                 <div className="space-y-4">
//                   <p className="text-gray-600 dark:text-gray-400 mb-4">
//                     Control who can see your information and interact with you.
//                   </p>

//                   <div className="space-y-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
//                     {/* Show Email */}
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium text-gray-900 dark:text-white">
//                           Show Email on Profile
//                         </p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           Let others see your email address
//                         </p>
//                       </div>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={privacySettings.showEmail}
//                           onChange={(e) =>
//                             setPrivacySettings({
//                               ...privacySettings,
//                               showEmail: e.target.checked,
//                             })
//                           }
//                           className="sr-only peer"
//                         />
//                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-400"></div>
//                       </label>
//                     </div>

//                     {/* Show Projects */}
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium text-gray-900 dark:text-white">
//                           Show Projects
//                         </p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           Display your projects publicly
//                         </p>
//                       </div>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={privacySettings.showProjects}
//                           onChange={(e) =>
//                             setPrivacySettings({
//                               ...privacySettings,
//                               showProjects: e.target.checked,
//                             })
//                           }
//                           className="sr-only peer"
//                         />
//                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-400"></div>
//                       </label>
//                     </div>

//                     {/* Allow Comments */}
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium text-gray-900 dark:text-white">
//                           Allow Comments
//                         </p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           Let people comment on your projects
//                         </p>
//                       </div>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={privacySettings.allowComments}
//                           onChange={(e) =>
//                             setPrivacySettings({
//                               ...privacySettings,
//                               allowComments: e.target.checked,
//                             })
//                           }
//                           className="sr-only peer"
//                         />
//                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-400"></div>
//                       </label>
//                     </div>

//                     {/* Allow Messages */}
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium text-gray-900 dark:text-white">
//                           Allow Messages
//                         </p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           Receive messages from other users
//                         </p>
//                       </div>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={privacySettings.allowMessages}
//                           onChange={(e) =>
//                             setPrivacySettings({
//                               ...privacySettings,
//                               allowMessages: e.target.checked,
//                             })
//                           }
//                           className="sr-only peer"
//                         />
//                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-400"></div>
//                       </label>
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => toast.success("Privacy settings updated!")}
//                     className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
//                   >
//                     Save Privacy Settings
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Notifications Tab */}
//             {activeTab === "notifications" && (
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//                   Notification Preferences
//                 </h2>
//                 <div className="space-y-4">
//                   <p className="text-gray-600 dark:text-gray-400 mb-4">
//                     Choose what notifications you want to receive.
//                   </p>

//                   <div className="space-y-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
//                     {/* Email Notifications */}
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium text-gray-900 dark:text-white">
//                           Email Notifications
//                         </p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           Receive email notifications
//                         </p>
//                       </div>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={notificationSettings.emailNotifications}
//                           onChange={(e) =>
//                             setNotificationSettings({
//                               ...notificationSettings,
//                               emailNotifications: e.target.checked,
//                             })
//                           }
//                           className="sr-only peer"
//                         />
//                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-400"></div>
//                       </label>
//                     </div>

//                     {/* Like Notifications */}
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium text-gray-900 dark:text-white">
//                           Like Notifications
//                         </p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           When someone likes your project
//                         </p>
//                       </div>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={notificationSettings.likeNotifications}
//                           onChange={(e) =>
//                             setNotificationSettings({
//                               ...notificationSettings,
//                               likeNotifications: e.target.checked,
//                             })
//                           }
//                           className="sr-only peer"
//                         />
//                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-400"></div>
//                       </label>
//                     </div>

//                     {/* Comment Notifications */}
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium text-gray-900 dark:text-white">
//                           Comment Notifications
//                         </p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           When someone comments on your project
//                         </p>
//                       </div>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={notificationSettings.commentNotifications}
//                           onChange={(e) =>
//                             setNotificationSettings({
//                               ...notificationSettings,
//                               commentNotifications: e.target.checked,
//                             })
//                           }
//                           className="sr-only peer"
//                         />
//                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-400"></div>
//                       </label>
//                     </div>

//                     {/* Follow Notifications */}
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium text-gray-900 dark:text-white">
//                           Follow Notifications
//                         </p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           When someone follows you
//                         </p>
//                       </div>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={notificationSettings.followNotifications}
//                           onChange={(e) =>
//                             setNotificationSettings({
//                               ...notificationSettings,
//                               followNotifications: e.target.checked,
//                             })
//                           }
//                           className="sr-only peer"
//                         />
//                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-400"></div>
//                       </label>
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => toast.success("Notification preferences updated!")}
//                     className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
//                   >
//                     Save Notification Settings
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Danger Zone Tab */}
//             {activeTab === "danger" && (
//               <div>
//                 <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-6">
//                   ⚠️ Danger Zone
//                 </h2>
//                 <div className="space-y-4">
//                   <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
//                     <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-2">
//                       Delete Account
//                     </h3>
//                     <p className="text-sm text-red-800 dark:text-red-300 mb-4">
//                       Once you delete your account, there is no going back. This will
//                       permanently delete all your projects, comments, and data.
//                     </p>
//                     <button
//                       onClick={handleDeleteAccount}
//                       disabled={loading}
//                       className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                     >
//                       {loading ? "Deleting..." : "Delete My Account"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }










// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { API } from "../api/api";
// import toast from "react-hot-toast";
// import ReactCrop from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";

// export default function Settings() {
//   const { user, logout, updateUser } = useAuth();
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState("profile");
//   const [loading, setLoading] = useState(false);

//   // Profile Settings
//   const [profileData, setProfileData] = useState({
//     username: "",
//     bio: "",
//     studentId: "",
//     batch: "",
//     batchAdvisor: "",
//     batchMentor: "",
//   });

//   const [avatar, setAvatar] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState(null);

//   // Image crop states
//   const [showCropper, setShowCropper] = useState(false);
//   const [imageToCrop, setImageToCrop] = useState(null);
//   const [crop, setCrop] = useState({
//     unit: "%",
//     width: 50,
//     height: 50,
//     x: 25,
//     y: 25,
//     aspect: 1,
//   });
//   const [completedCrop, setCompletedCrop] = useState(null);
//   const [imageRef, setImageRef] = useState(null);

//   // Account Settings
//   const [accountData, setAccountData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   // Social Links
//   const [socialLinks, setSocialLinks] = useState({
//     linkedin: "",
//     github: "",
//     behance: "",
//     portfolio: "",
//     twitter: "",
//     instagram: "",
//     facebook: "",
//   });

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     // Load user data
//     setProfileData({
//       username: user.username || "",
//       bio: user.bio || "",
//       studentId: user.studentId || "",
//       batch: user.batch || "",
//       batchAdvisor: user.batchAdvisor || "",
//       batchMentor: user.batchMentor || "",
//     });

//     setAvatarPreview(user.avatar || null);

//     setSocialLinks(
//       user.socialLinks || {
//         linkedin: "",
//         github: "",
//         behance: "",
//         portfolio: "",
//         twitter: "",
//         instagram: "",
//         facebook: "",
//       }
//     );
//   }, [user, navigate]);

//   // Avatar handling
//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select an image file");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("Image size should be less than 5MB");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImageToCrop(reader.result);
//       setShowCropper(true);
//       setCrop({
//         unit: "%",
//         width: 50,
//         height: 50,
//         x: 25,
//         y: 25,
//         aspect: 1,
//       });
//     };
//     reader.readAsDataURL(file);
//   };

//   const getCroppedImg = () => {
//     if (!completedCrop || !imageRef) {
//       toast.error("Please select a crop area");
//       return null;
//     }

//     const canvas = document.createElement("canvas");
//     const scaleX = imageRef.naturalWidth / imageRef.width;
//     const scaleY = imageRef.naturalHeight / imageRef.height;

//     canvas.width = completedCrop.width;
//     canvas.height = completedCrop.height;
//     const ctx = canvas.getContext("2d");

//     ctx.drawImage(
//       imageRef,
//       completedCrop.x * scaleX,
//       completedCrop.y * scaleY,
//       completedCrop.width * scaleX,
//       completedCrop.height * scaleY,
//       0,
//       0,
//       completedCrop.width,
//       completedCrop.height
//     );

//     return new Promise((resolve) => {
//       canvas.toBlob(
//         (blob) => {
//           if (!blob) {
//             toast.error("Failed to crop image");
//             resolve(null);
//             return;
//           }
//           const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
//           resolve(file);
//         },
//         "image/jpeg",
//         0.95
//       );
//     });
//   };

//   const handleCropComplete = async () => {
//     const croppedFile = await getCroppedImg();
//     if (croppedFile) {
//       setAvatar(croppedFile);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatarPreview(reader.result);
//         setShowCropper(false);
//         toast.success("Image cropped successfully!");
//       };
//       reader.readAsDataURL(croppedFile);
//     }
//   };

//   // Update Profile (with avatar and social links)
//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const loadingToast = toast.loading("Updating profile...");

//     try {
//       const form = new FormData();
//       form.append("username", profileData.username);
//       form.append("bio", profileData.bio);
//       form.append("studentId", profileData.studentId);
//       form.append("batch", profileData.batch);
//       form.append("batchAdvisor", profileData.batchAdvisor);
//       form.append("batchMentor", profileData.batchMentor);
//       form.append("socialLinks", JSON.stringify(socialLinks));

//       if (avatar) {
//         form.append("avatar", avatar);
//       }

//       const token = localStorage.getItem("token");

//       const res = await API.put("/users/profile", form, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       updateUser(res.data.user);

//       if (res.data.user.avatar) {
//         setAvatarPreview(res.data.user.avatar);
//       }

//       toast.success("Profile updated successfully!", { id: loadingToast });
//     } catch (err) {
//       console.error("Update error:", err);
//       toast.error(err.response?.data?.message || "Failed to update profile", {
//         id: loadingToast,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update Account (Password)
//   const handleUpdateAccount = async (e) => {
//     e.preventDefault();

//     if (
//       accountData.newPassword &&
//       accountData.newPassword !== accountData.confirmPassword
//     ) {
//       toast.error("Passwords don't match!");
//       return;
//     }

//     if (accountData.newPassword && accountData.newPassword.length < 6) {
//       toast.error("Password must be at least 6 characters");
//       return;
//     }

//     setLoading(true);
//     const loadingToast = toast.loading("Updating account...");

//     try {
//       const token = localStorage.getItem("token");
//       const updateData = {
//         username: profileData.username,
//       };

//       if (accountData.newPassword) {
//         updateData.currentPassword = accountData.currentPassword;
//         updateData.newPassword = accountData.newPassword;
//       }

//       await API.put("/users/account", updateData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("Account updated successfully!", { id: loadingToast });

//       // Clear password fields
//       setAccountData({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//     } catch (err) {
//       console.error("Update account error:", err);
//       toast.error(err.response?.data?.message || "Failed to update account", {
//         id: loadingToast,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete Account
//   const handleDeleteAccount = async () => {
//     const confirmed = window.confirm(
//       "⚠️ WARNING: This will permanently delete your account and all your projects!\n\nType 'DELETE' to confirm:"
//     );

//     if (!confirmed) return;

//     const userInput = prompt("Type 'DELETE' to confirm:");
//     if (userInput !== "DELETE") {
//       toast.error("Account deletion cancelled");
//       return;
//     }

//     setLoading(true);
//     const loadingToast = toast.loading("Deleting account...");

//     try {
//       const token = localStorage.getItem("token");

//       await API.delete("/users/account", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("Account deleted successfully", { id: loadingToast });
//       logout();
//       navigate("/");
//     } catch (err) {
//       console.error("Delete account error:", err);
//       toast.error(err.response?.data?.message || "Failed to delete account", {
//         id: loadingToast,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Image Cropper Modal */}
//       {showCropper && imageToCrop && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
//             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
//               Crop Profile Picture
//             </h3>

//             <div className="mb-4 flex justify-center">
//               <ReactCrop
//                 crop={crop}
//                 onChange={(c) => setCrop(c)}
//                 onComplete={(c) => setCompletedCrop(c)}
//                 aspect={1}
//                 circularCrop
//               >
//                 <img
//                   src={imageToCrop}
//                   alt="Crop preview"
//                   onLoad={(e) => setImageRef(e.target)}
//                   style={{ maxHeight: "60vh", maxWidth: "100%" }}
//                 />
//               </ReactCrop>
//             </div>

//             <div className="flex gap-4">
//               <button
//                 type="button"
//                 onClick={handleCropComplete}
//                 className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
//               >
//                 Apply Crop
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowCropper(false);
//                   setImageToCrop(null);
//                 }}
//                 className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
//         {/* Header */}
//         <div className="border-b border-gray-200 dark:border-gray-700 p-6">
//           <div className="flex items-center justify-between">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//               Settings
//             </h1>
//             <button
//               onClick={() => navigate("/profile")}
//               className="text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-colors"
//             >
//               ← Back to Profile
//             </button>
//           </div>
//         </div>

//         <div className="flex flex-col md:flex-row">
//           {/* Sidebar Tabs */}
//           <div className="md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-6">
//             <nav className="space-y-2">
//               <button
//                 onClick={() => setActiveTab("profile")}
//                 className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                   activeTab === "profile"
//                     ? "bg-amber-400 text-white"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 }`}
//               >
//                 👤 Profile
//               </button>
//               <button
//                 onClick={() => setActiveTab("account")}
//                 className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                   activeTab === "account"
//                     ? "bg-amber-400 text-white"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 }`}
//               >
//                 🔐 Account
//               </button>
//               <button
//                 onClick={() => setActiveTab("social")}
//                 className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                   activeTab === "social"
//                     ? "bg-amber-400 text-white"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 }`}
//               >
//                 🔗 Social Links
//               </button>
//               <button
//                 onClick={() => setActiveTab("danger")}
//                 className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                   activeTab === "danger"
//                     ? "bg-red-500 text-white"
//                     : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
//                 }`}
//               >
//                 ⚠️ Danger Zone
//               </button>
//             </nav>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1 p-6">
//             {/* Profile Tab */}
//             {activeTab === "profile" && (
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//                   Profile Settings
//                 </h2>
//                 <form onSubmit={handleUpdateProfile}>
//                   {/* Avatar */}
//                   <div className="mb-6 text-center">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Profile Picture
//                     </label>

//                     <div className="flex flex-col items-center">
//                       {avatarPreview ? (
//                         <img
//                           src={avatarPreview}
//                           alt="Avatar"
//                           className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 mb-4"
//                         />
//                       ) : (
//                         <div className="w-32 h-32 rounded-full bg-amber-400 flex items-center justify-center text-white text-4xl font-bold mb-4">
//                           {profileData.username?.charAt(0).toUpperCase()}
//                         </div>
//                       )}

//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleAvatarChange}
//                         className="hidden"
//                         id="avatar-upload"
//                         disabled={loading}
//                       />
//                       <label
//                         htmlFor="avatar-upload"
//                         className="bg-amber-400 hover:bg-amber-400/80 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
//                       >
//                         {avatarPreview ? "Change Picture" : "Upload Picture"}
//                       </label>
//                     </div>
//                   </div>

//                   {/* Username */}
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Username
//                     </label>
//                     <input
//                       type="text"
//                       value={profileData.username}
//                       onChange={(e) =>
//                         setProfileData({ ...profileData, username: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                       required
//                       disabled={loading}
//                     />
//                   </div>

//                   {/* Bio */}
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Bio
//                     </label>
//                     <textarea
//                       value={profileData.bio}
//                       onChange={(e) =>
//                         setProfileData({ ...profileData, bio: e.target.value })
//                       }
//                       rows="4"
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
//                       disabled={loading}
//                       placeholder="Tell us about yourself..."
//                     />
//                   </div>

//                   {/* Student Details */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         Student ID
//                       </label>
//                       <input
//                         type="text"
//                         value={profileData.studentId}
//                         onChange={(e) =>
//                           setProfileData({ ...profileData, studentId: e.target.value })
//                         }
//                         className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                         disabled={loading}
//                         placeholder="e.g. 221-40-041"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         Batch
//                       </label>
//                       <input
//                         type="text"
//                         value={profileData.batch}
//                         onChange={(e) =>
//                           setProfileData({ ...profileData, batch: e.target.value })
//                         }
//                         className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                         disabled={loading}
//                         placeholder="e.g. 31"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         Batch Advisor
//                       </label>
//                       <input
//                         type="text"
//                         value={profileData.batchAdvisor}
//                         onChange={(e) =>
//                           setProfileData({
//                             ...profileData,
//                             batchAdvisor: e.target.value,
//                           })
//                         }
//                         className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                         disabled={loading}
//                         placeholder="Advisor name"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         Batch Mentor
//                       </label>
//                       <input
//                         type="text"
//                         value={profileData.batchMentor}
//                         onChange={(e) =>
//                           setProfileData({
//                             ...profileData,
//                             batchMentor: e.target.value,
//                           })
//                         }
//                         className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                         disabled={loading}
//                         placeholder="Mentor name"
//                       />
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                   >
//                     {loading ? "Saving..." : "Save Profile"}
//                   </button>
//                 </form>
//               </div>
//             )}

//             {/* Account Tab */}
//             {activeTab === "account" && (
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//                   Account Settings
//                 </h2>
//                 <form onSubmit={handleUpdateAccount} className="space-y-4">
//                   {/* Email (Read-only) */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       value={user.email}
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
//                       disabled
//                     />
//                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                       Email cannot be changed
//                     </p>
//                   </div>

//                   {/* Change Password Section */}
//                   <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                       Change Password
//                     </h3>

//                     <div className="space-y-4">
//                       {/* Current Password */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Current Password
//                         </label>
//                         <input
//                           type="password"
//                           value={accountData.currentPassword}
//                           onChange={(e) =>
//                             setAccountData({
//                               ...accountData,
//                               currentPassword: e.target.value,
//                             })
//                           }
//                           className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                           disabled={loading}
//                           placeholder="Enter current password"
//                         />
//                       </div>

//                       {/* New Password */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           New Password
//                         </label>
//                         <input
//                           type="password"
//                           value={accountData.newPassword}
//                           onChange={(e) =>
//                             setAccountData({
//                               ...accountData,
//                               newPassword: e.target.value,
//                             })
//                           }
//                           className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                           disabled={loading}
//                           placeholder="Enter new password (min 6 characters)"
//                           minLength={6}
//                         />
//                       </div>

//                       {/* Confirm Password */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Confirm New Password
//                         </label>
//                         <input
//                           type="password"
//                           value={accountData.confirmPassword}
//                           onChange={(e) =>
//                             setAccountData({
//                               ...accountData,
//                               confirmPassword: e.target.value,
//                             })
//                           }
//                           className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                           disabled={loading}
//                           placeholder="Confirm new password"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                   >
//                     {loading ? "Saving..." : "Save Changes"}
//                   </button>
//                 </form>
//               </div>
//             )}

//             {/* Social Links Tab */}
//             {activeTab === "social" && (
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//                   Social Links
//                 </h2>
//                 <form onSubmit={handleUpdateProfile} className="space-y-4">
//                   {/* LinkedIn */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       🔗 LinkedIn
//                     </label>
//                     <input
//                       type="url"
//                       value={socialLinks.linkedin || ""}
//                       onChange={(e) =>
//                         setSocialLinks({ ...socialLinks, linkedin: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                       disabled={loading}
//                       placeholder="https://linkedin.com/in/username"
//                     />
//                   </div>

//                   {/* GitHub */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       💻 GitHub
//                     </label>
//                     <input
//                       type="url"
//                       value={socialLinks.github || ""}
//                       onChange={(e) =>
//                         setSocialLinks({ ...socialLinks, github: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                       disabled={loading}
//                       placeholder="https://github.com/username"
//                     />
//                   </div>

//                   {/* Behance */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       🎨 Behance
//                     </label>
//                     <input
//                       type="url"
//                       value={socialLinks.behance || ""}
//                       onChange={(e) =>
//                         setSocialLinks({ ...socialLinks, behance: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                       disabled={loading}
//                       placeholder="https://behance.net/username"
//                     />
//                   </div>

//                   {/* Portfolio */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       🌐 Portfolio Website
//                     </label>
//                     <input
//                       type="url"
//                       value={socialLinks.portfolio || ""}
//                       onChange={(e) =>
//                         setSocialLinks({
//                           ...socialLinks,
//                           portfolio: e.target.value,
//                         })
//                       }
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                       disabled={loading}
//                       placeholder="https://yourportfolio.com"
//                     />
//                   </div>

//                   {/* Twitter */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       🐦 Twitter
//                     </label>
//                     <input
//                       type="url"
//                       value={socialLinks.twitter || ""}
//                       onChange={(e) =>
//                         setSocialLinks({ ...socialLinks, twitter: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                       disabled={loading}
//                       placeholder="https://twitter.com/username"
//                     />
//                   </div>

//                   {/* Instagram */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       📷 Instagram
//                     </label>
//                     <input
//                       type="url"
//                       value={socialLinks.instagram || ""}
//                       onChange={(e) =>
//                         setSocialLinks({
//                           ...socialLinks,
//                           instagram: e.target.value,
//                         })
//                       }
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                       disabled={loading}
//                       placeholder="https://instagram.com/username"
//                     />
//                   </div>

//                   {/* Facebook */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       📘 Facebook
//                     </label>
//                     <input
//                       type="url"
//                       value={socialLinks.facebook || ""}
//                       onChange={(e) =>
//                         setSocialLinks({ ...socialLinks, facebook: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//                       disabled={loading}
//                       placeholder="https://facebook.com/username"
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                   >
//                     {loading ? "Saving..." : "Save Social Links"}
//                   </button>
//                 </form>
//               </div>
//             )}

//             {/* Danger Zone Tab */}
//             {activeTab === "danger" && (
//               <div>
//                 <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-6">
//                   ⚠️ Danger Zone
//                 </h2>
//                 <div className="space-y-4">
//                   <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
//                     <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-2">
//                       Delete Account
//                     </h3>
//                     <p className="text-sm text-red-800 dark:text-red-300 mb-4">
//                       Once you delete your account, there is no going back. This will
//                       permanently delete all your projects, comments, and data.
//                     </p>
//                     <button
//                       onClick={handleDeleteAccount}
//                       disabled={loading}
//                       className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                     >
//                       {loading ? "Deleting..." : "Delete My Account"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }











import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API } from "../api/api";
import toast from "react-hot-toast";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function Settings() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  // Profile Settings
  const [profileData, setProfileData] = useState({
    username: "",
    bio: "",
    studentId: "",
    batch: "",
    batchAdvisor: "",
    batchMentor: "",
    role: "student",
    designation: "",
    department: "Multimedia and Creative Technology",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Image crop states
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 25,
    aspect: 1,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageRef, setImageRef] = useState(null);

  // Account Settings
  const [accountData, setAccountData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Social Links
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    github: "",
    behance: "",
    portfolio: "",
    twitter: "",
    instagram: "",
    facebook: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Load user data
    setProfileData({
      username: user.username || "",
      bio: user.bio || "",
      studentId: user.studentId || "",
      batch: user.batch || "",
      batchAdvisor: user.batchAdvisor || "",
      batchMentor: user.batchMentor || "",
      role: user.role || "student",
      designation: user.designation || "",
      department: user.department || "Multimedia and Creative Technology",
    });

    setAvatarPreview(user.avatar || null);

    setSocialLinks(
      user.socialLinks || {
        linkedin: "",
        github: "",
        behance: "",
        portfolio: "",
        twitter: "",
        instagram: "",
        facebook: "",
      }
    );
  }, [user, navigate]);

  // Avatar handling
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result);
      setShowCropper(true);
      setCrop({
        unit: "%",
        width: 50,
        height: 50,
        x: 25,
        y: 25,
        aspect: 1,
      });
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImg = () => {
    if (!completedCrop || !imageRef) {
      toast.error("Please select a crop area");
      return null;
    }

    const canvas = document.createElement("canvas");
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      imageRef,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            toast.error("Failed to crop image");
            resolve(null);
            return;
          }
          const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
          resolve(file);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleCropComplete = async () => {
    const croppedFile = await getCroppedImg();
    if (croppedFile) {
      setAvatar(croppedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setShowCropper(false);
        toast.success("Image cropped successfully!");
      };
      reader.readAsDataURL(croppedFile);
    }
  };

  // Update Profile (with avatar and social links)
  const handleUpdateProfile = async (e) => {
  e.preventDefault();
  setLoading(true);
  const loadingToast = toast.loading("Updating profile...");

  try {
    const form = new FormData();
    form.append("username", profileData.username);
    form.append("bio", profileData.bio);
    form.append("studentId", profileData.studentId);
    form.append("batch", profileData.batch);
    form.append("batchAdvisor", profileData.batchAdvisor);
    form.append("batchMentor", profileData.batchMentor);
    form.append("role", profileData.role);
    form.append("designation", profileData.designation);
    form.append("department", profileData.department);
    form.append("socialLinks", JSON.stringify(socialLinks));

    if (avatar) {
      form.append("avatar", avatar);
    }

    // ✅ Log what we're sending
    console.log("📤 Sending data to API:");
    console.log({
      username: profileData.username,
      role: profileData.role,
      designation: profileData.designation,
      department: profileData.department,
      batch: profileData.batch,
      studentId: profileData.studentId,
    });

    const token = localStorage.getItem("token");

    const res = await API.put("/users/profile", form, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ Log the full response
    console.log("📥 Full API response:", res.data);
    console.log("📥 User data from API:", res.data.user);
    
    // ✅ Check specific fields
    console.log("🔍 Checking received fields:");
    console.log("  - Role:", res.data.user.role);
    console.log("  - Designation:", res.data.user.designation);
    console.log("  - Department:", res.data.user.department);

    // ✅ Update user in context
    console.log("🔄 Calling updateUser with:", res.data.user);
    updateUser(res.data.user);

    if (res.data.user.avatar) {
      setAvatarPreview(res.data.user.avatar);
    }

    toast.success("Profile updated successfully!", { id: loadingToast });
    
    // ✅ Verify localStorage after update
    setTimeout(() => {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      console.log("💾 User in localStorage after update:", savedUser);
      console.log("  - Role:", savedUser.role);
      console.log("  - Designation:", savedUser.designation);
    }, 100);
    
  } catch (err) {
    console.error("❌ Update error:", err);
    console.error("❌ Error response:", err.response?.data);
    toast.error(err.response?.data?.message || "Failed to update profile", {
      id: loadingToast,
    });
  } finally {
    setLoading(false);
  }
};

  // Update Account (Password)
  const handleUpdateAccount = async (e) => {
    e.preventDefault();

    if (
      accountData.newPassword &&
      accountData.newPassword !== accountData.confirmPassword
    ) {
      toast.error("Passwords don't match!");
      return;
    }

    if (accountData.newPassword && accountData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Updating account...");

    try {
      const token = localStorage.getItem("token");
      const updateData = {
        username: profileData.username,
      };

      if (accountData.newPassword) {
        updateData.currentPassword = accountData.currentPassword;
        updateData.newPassword = accountData.newPassword;
      }

      await API.put("/users/account", updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Account updated successfully!", { id: loadingToast });

      // Clear password fields
      setAccountData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Update account error:", err);
      toast.error(err.response?.data?.message || "Failed to update account", {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "⚠️ WARNING: This will permanently delete your account and all your projects!\n\nType 'DELETE' to confirm:"
    );

    if (!confirmed) return;

    const userInput = prompt("Type 'DELETE' to confirm:");
    if (userInput !== "DELETE") {
      toast.error("Account deletion cancelled");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Deleting account...");

    try {
      const token = localStorage.getItem("token");

      await API.delete("/users/account", {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Account deleted successfully", { id: loadingToast });
      logout();
      navigate("/");
    } catch (err) {
      console.error("Delete account error:", err);
      toast.error(err.response?.data?.message || "Failed to delete account", {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Image Cropper Modal */}
      {showCropper && imageToCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Crop Profile Picture
            </h3>

            <div className="mb-4 flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  src={imageToCrop}
                  alt="Crop preview"
                  onLoad={(e) => setImageRef(e.target)}
                  style={{ maxHeight: "60vh", maxWidth: "100%" }}
                />
              </ReactCrop>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCropComplete}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Apply Crop
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCropper(false);
                  setImageToCrop(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
            <button
              onClick={() => navigate("/profile")}
              className="text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-colors"
            >
              ← Back to Profile
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar Tabs */}
          <div className="md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "profile"
                    ? "bg-amber-400 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                👤 Profile
              </button>
              <button
                onClick={() => setActiveTab("account")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "account"
                    ? "bg-amber-400 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                🔐 Account
              </button>
              <button
                onClick={() => setActiveTab("social")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "social"
                    ? "bg-amber-400 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                🔗 Social Links
              </button>
              <button
                onClick={() => setActiveTab("danger")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "danger"
                    ? "bg-red-500 text-white"
                    : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                }`}
              >
                ⚠️ Danger Zone
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Profile Settings
                </h2>
                <form onSubmit={handleUpdateProfile}>
                  {/* Avatar */}
                  <div className="mb-6 text-center">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Profile Picture
                    </label>

                    <div className="flex flex-col items-center">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 mb-4"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-amber-400 flex items-center justify-center text-white text-4xl font-bold mb-4">
                          {profileData.username?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        id="avatar-upload"
                        disabled={loading}
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="bg-amber-400 hover:bg-amber-400/80 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                      >
                        {avatarPreview ? "Change Picture" : "Upload Picture"}
                      </label>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) =>
                        setProfileData({ ...profileData, username: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Bio */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      rows="4"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      disabled={loading}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Role Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      I am a
                    </label>
                    <select
                      value={profileData.role}
                      onChange={(e) =>
                        setProfileData({ ...profileData, role: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
                      disabled={loading}
                    >
                      <option value="student">🎓 Student</option>
                      <option value="teacher">👨‍🏫 Teacher/Instructor</option>
                    </select>
                  </div>

                  {/* Designation */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={profileData.designation}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          designation: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
                      disabled={loading}
                      placeholder="e.g. Undergraduate Student, Lecturer, etc."
                    />
                  </div>

                  {/* Department */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={profileData.department}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          department: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
                      disabled={loading}
                      placeholder="e.g. Multimedia and Creative Technology"
                    />
                  </div>

                  {/* Student Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Student ID
                      </label>
                      <input
                        type="text"
                        value={profileData.studentId}
                        onChange={(e) =>
                          setProfileData({ ...profileData, studentId: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        disabled={loading}
                        placeholder="e.g. 221-40-041"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Batch
                      </label>
                      <input
                        type="text"
                        value={profileData.batch}
                        onChange={(e) =>
                          setProfileData({ ...profileData, batch: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        disabled={loading}
                        placeholder="e.g. 31"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Batch Advisor
                      </label>
                      <input
                        type="text"
                        value={profileData.batchAdvisor}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            batchAdvisor: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        disabled={loading}
                        placeholder="Advisor name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Batch Mentor
                      </label>
                      <input
                        type="text"
                        value={profileData.batchMentor}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            batchMentor: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        disabled={loading}
                        placeholder="Mentor name"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save Profile"}
                  </button>
                </form>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Account Settings
                </h2>
                <form onSubmit={handleUpdateAccount} className="space-y-4">
                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Change Password Section */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Change Password
                    </h3>

                    <div className="space-y-4">
                      {/* Current Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={accountData.currentPassword}
                          onChange={(e) =>
                            setAccountData({
                              ...accountData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
                          disabled={loading}
                          placeholder="Enter current password"
                        />
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={accountData.newPassword}
                          onChange={(e) =>
                            setAccountData({
                              ...accountData,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
                          disabled={loading}
                          placeholder="Enter new password (min 6 characters)"
                          minLength={6}
                        />
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={accountData.confirmPassword}
                          onChange={(e) =>
                            setAccountData({
                              ...accountData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
                          disabled={loading}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {/* Social Links Tab */}
            {activeTab === "social" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Social Links
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {/* LinkedIn */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      🔗 LinkedIn
                    </label>
                    <input
                      type="url"
                      value={socialLinks.linkedin || ""}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, linkedin: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
                      disabled={loading}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  {/* GitHub */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      💻 GitHub
                    </label>
                    <input
                      type="url"
                      value={socialLinks.github || ""}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, github: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
                      disabled={loading}
                      placeholder="https://github.com/username"
                    />
                  </div>

                  {/* Behance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      🎨 Behance
                    </label>
                    <input
                      type="url"
                      value={socialLinks.behance || ""}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, behance: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
                      disabled={loading}
                      placeholder="https://behance.net/username"
                    />
                  </div>

                  {/* Portfolio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      🌐 Portfolio Website
                    </label>
                    <input
                      type="url"
                      value={socialLinks.portfolio || ""}
                      onChange={(e) =>
                        setSocialLinks({
                          ...socialLinks,
                          portfolio: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
                      disabled={loading}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>

                  {/* Twitter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      🐦 Twitter
                    </label>
                    <input
                      type="url"
                      value={socialLinks.twitter || ""}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, twitter: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
                      disabled={loading}
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      📷 Instagram
                    </label>
                    <input
                      type="url"
                      value={socialLinks.instagram || ""}
                      onChange={(e) =>
                        setSocialLinks({
                          ...socialLinks,
                          instagram: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
                      disabled={loading}
                      placeholder="https://instagram.com/username"
                    />
                  </div>

                  {/* Facebook */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      📘 Facebook
                    </label>
                    <input
                      type="url"
                      value={socialLinks.facebook || ""}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, facebook: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
                      disabled={loading}
                      placeholder="https://facebook.com/username"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save Social Links"}
                  </button>
                </form>
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === "danger" && (
              <div>
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-6">
                  ⚠️ Danger Zone
                </h2>
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-2">
                      Delete Account
                    </h3>
                    <p className="text-sm text-red-800 dark:text-red-300 mb-4">
                      Once you delete your account, there is no going back. This will
                      permanently delete all your projects, comments, and data.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? "Deleting..." : "Delete My Account"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}