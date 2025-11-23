import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API } from "../api/api";
import { toast } from 'sonner';
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      const token = localStorage.getItem("token");

      const res = await API.put("/users/profile", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      updateUser(res.data.user);

      if (res.data.user.avatar) {
        setAvatarPreview(res.data.user.avatar);
      }

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("❌ Update error:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

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

      toast.success("Account updated successfully!");

      setAccountData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Update account error:", err);
      toast.error(err.response?.data?.message || "Failed to update account");
    } finally {
      setLoading(false);
    }
  };

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

    try {
      const token = localStorage.getItem("token");

      await API.delete("/users/account", {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Account deleted successfully");
      logout();
      navigate("/");
    } catch (err) {
      console.error("Delete account error:", err);
      toast.error(err.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-4 lg:p-6">
      {/* Image Cropper Modal */}
      {showCropper && imageToCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
              Crop Profile Picture
            </h3>

            <div className="mb-3 md:mb-4 flex justify-center">
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

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <button
                type="button"
                onClick={handleCropComplete}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm md:text-base"
              >
                Apply Crop
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCropper(false);
                  setImageToCrop(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm md:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-stone-900 rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b-1 border-stone-700 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-stone-100">
              Settings
            </h1>
            <button
              onClick={() => navigate("/profile")}
              className="text-stone-300 hover:text-blue-400 transition-colors text-sm md:text-base"
            >
              ← Back to Profile
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar Tabs */}
          <div className="md:w-64 border-b md:border-b-0 md:border-r border-stone-700 p-4 md:p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-3 md:px-4 py-2 !rounded-sm transition-colors text-sm md:text-base ${
                  activeTab === "profile"
                    ? "bg-blue-600 text-stone-100"
                    : "text-stone-300 hover:bg-stone-800"
                }`}
              >
                 Profile
              </button>
              <button
                onClick={() => setActiveTab("account")}
                className={`w-full text-left px-3 md:px-4 py-2 !rounded-sm transition-colors text-sm md:text-base ${
                  activeTab === "account"
                    ? "bg-blue-600 text-stone-100"
                    : "text-stone-300 hover:bg-stone-800"
                }`}
              >
                 Account
              </button>
              <button
                onClick={() => setActiveTab("social")}
                className={`w-full text-left px-3 md:px-4 py-2 !rounded-sm transition-colors text-sm md:text-base ${
                  activeTab === "social"
                    ? "bg-blue-600 text-stone-100"
                    : "text-stone-300 hover:bg-stone-800"
                }`}
              >
                 Social Links
              </button>
              <button
                onClick={() => setActiveTab("danger")}
                className={`w-full text-left px-3 md:px-4 py-2 !rounded-sm transition-colors text-sm md:text-base ${
                  activeTab === "danger"
                    ? "bg-red-600 text-stone-100"
                    : "text-red-600 hover:bg-red-900/40"
                }`}
              >
                 Danger Zone
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 md:p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-stone-100 mb-4 md:mb-6">
                  Profile Settings
                </h2>
                <form onSubmit={handleUpdateProfile}>
                  {/* Avatar */}
                  <div className="mb-4 md:mb-6 text-center">
                    <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
                      Profile Picture
                    </label>

                    <div className="flex flex-col items-center">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="w-24 h-24 md:w-32 md:h-32 rounded-sm object-cover border-4 border-stone-800 mb-3 md:mb-4"
                        />
                      ) : (
                        <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-stone-800 rounded-sm bg-stone-900 flex items-center justify-center text-stone-100 !text-5xl md:text-4xl font-bold mb-3 md:mb-4">
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
                        className="bg-blue-600 hover:bg-stone-800 text-white px-3 md:px-4 py-2 rounded-sm cursor-pointer transition-colors text-sm md:text-base"
                      >
                        {avatarPreview ? "Change Picture" : "Upload Picture"}
                      </label>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="mb-3 md:mb-4">
                    <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) =>
                        setProfileData({ ...profileData, username: e.target.value })
                      }
                      className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Bio */}
                  <div className="mb-3 md:mb-4">
                    <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      rows="4"
                      className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                      disabled={loading}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Role Selection */}
                  <div className="mb-3 md:mb-4">
                    <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
                      I am a
                    </label>
                    <select
                      value={profileData.role}
                      onChange={(e) =>
                        setProfileData({ ...profileData, role: e.target.value })
                      }
                      className="w-full h-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                      disabled={loading}
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher/Instructor</option>
                    </select>
                  </div>

                  {/* Designation */}
                  <div className="mb-3 md:mb-4">
                    <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
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
                      className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                      disabled={loading}
                      placeholder="e.g. Undergraduate Student, Lecturer, etc."
                    />
                  </div>

                  {/* Department */}
                  <div className="mb-3 md:mb-4">
                    <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
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
                      className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                      disabled={loading}
                      placeholder="e.g. Multimedia and Creative Technology"
                    />
                  </div>

                  {/* Student Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
                        Student ID
                      </label>
                      <input
                        type="text"
                        value={profileData.studentId}
                        onChange={(e) =>
                          setProfileData({ ...profileData, studentId: e.target.value })
                        }
                        className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                        disabled={loading}
                        placeholder="e.g. 221-40-041"
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
                        Batch
                      </label>
                      <input
                        type="text"
                        value={profileData.batch}
                        onChange={(e) =>
                          setProfileData({ ...profileData, batch: e.target.value })
                        }
                        className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                        disabled={loading}
                        placeholder="e.g. 31"
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
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
                        className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                        disabled={loading}
                        placeholder="Advisor name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
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
                        className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                        disabled={loading}
                        placeholder="Mentor name"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-stone-800 text-white font-semibold px-4 md:px-6 py-2 md:py-3 !rounded-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    {loading ? "Saving..." : "Save Profile"}
                  </button>
                </form>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-stone-100 mb-4 md:mb-6">
                  Account Settings
                </h2>
                <form onSubmit={handleUpdateAccount} className="space-y-3 md:space-y-4">
                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-500"
                      disabled
                    />
                    <p className="text-xs text-stone-400 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Change Password Section */}
                  <div className="pt-3 md:pt-4 border-t border-stone-700">
                    <h3 className="text-base md:text-lg font-semibold text-stone-200 mb-3 md:mb-4">
                      Change Password
                    </h3>

                    <div className="space-y-3 md:space-y-4">
                      {/* Current Password */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
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
                          className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                          disabled={loading}
                          placeholder="Enter current password"
                        />
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
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
                          className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                          disabled={loading}
                          placeholder="Enter new password (min 6 characters)"
                          minLength={6}
                        />
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
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
                          className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                          disabled={loading}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-stone-800 text-white font-semibold px-4 md:px-6 py-2 md:py-3 !rounded-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {/* Social Links Tab */}
            {activeTab === "social" && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-stone-100 mb-4 md:mb-6">
                  Social Links
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-3 md:space-y-4">
                  
                  {/* Portfolio */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
                      Portfolio Website
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
                      className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                      disabled={loading}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  
                  {/* LinkedIn */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={socialLinks.linkedin || ""}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, linkedin: e.target.value })
                      }
                      className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                      disabled={loading}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  {/* GitHub */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={socialLinks.github || ""}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, github: e.target.value })
                      }
                      className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                      disabled={loading}
                      placeholder="https://github.com/username"
                    />
                  </div>

                  {/* Behance */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
                      Behance
                    </label>
                    <input
                      type="url"
                      value={socialLinks.behance || ""}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, behance: e.target.value })
                      }
                      className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                      disabled={loading}
                      placeholder="https://behance.net/username"
                    />
                  </div>

                  

                  {/* Twitter */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={socialLinks.twitter || ""}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, twitter: e.target.value })
                      }
                      className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                      disabled={loading}
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
                       Instagram
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
                      className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                      disabled={loading}
                      placeholder="https://instagram.com/username"
                    />
                  </div>

                  {/* Facebook */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-stone-300 mb-2">
                       Facebook
                    </label>
                    <input
                      type="url"
                      value={socialLinks.facebook || ""}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, facebook: e.target.value })
                      }
                      className="w-full p-2 md:p-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-800 text-stone-200"
                      disabled={loading}
                      placeholder="https://facebook.com/username"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-stone-800 text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    {loading ? "Saving..." : "Save Social Links"}
                  </button>
                </form>
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === "danger" && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400 mb-4 md:mb-6">
                  ⚠️ Danger Zone
                </h2>
                <div className="space-y-3 md:space-y-4">
                  <div className="bg-red-900/20 border border-red-800 rounded-sm p-4 md:p-6">
                    <h3 className="text-base md:text-lg font-semibold text-red-400 mb-2">
                      Delete Account
                    </h3>
                    <p className="text-xs md:text-sm text-red-300 mb-3 md:mb-4">
                      Once you delete your account, there is no going back. This will
                      permanently delete all your projects, comments, and data.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="bg-red-600 hover:bg-stone-800 text-stone-100 font-semibold px-4 md:px-6 py-2 md:py-3 !rounded-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm md:text-base"
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