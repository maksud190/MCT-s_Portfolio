import { useState, useEffect } from "react";
import { API } from "../api/api";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TeacherAnnouncement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "info",
    isActive: true,
    expiresAt: "",
  });

  // Check if user is teacher
  useEffect(() => {
    if (user && user.role !== "teacher") {
      toast.error("Only teachers can access this page");
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.role === "teacher") {
      fetchAnnouncements();
    }
  }, [user]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/teacher/announcements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const data = {
        ...form,
        expiresAt: form.expiresAt || null,
      };

      if (editingAnnouncement) {
        await API.put(`/teacher/announcements/${editingAnnouncement._id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Announcement updated successfully! 🎉");
      } else {
        await API.post("/teacher/announcements", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Announcement created successfully! 🎉");
      }

      setShowModal(false);
      setEditingAnnouncement(null);
      setForm({
        title: "",
        content: "",
        type: "info",
        isActive: true,
        expiresAt: "",
      });
      fetchAnnouncements();
    } catch (err) {
      console.error("Error saving announcement:", err);
      toast.error(err.response?.data?.message || "Failed to save announcement");
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setForm({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      isActive: announcement.isActive,
      expiresAt: announcement.expiresAt
        ? new Date(announcement.expiresAt).toISOString().slice(0, 16)
        : "",
    });
    setShowModal(true);
  };

  const handleDelete = async (announcementId, title) => {
    if (
      !window.confirm(
        `⚠️ Delete announcement "${title}"?\n\nThis action cannot be undone.`
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/teacher/announcements/${announcementId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Announcement deleted successfully! 🗑️");
      fetchAnnouncements();
    } catch (err) {
      console.error("Error deleting announcement:", err);
      toast.error("Failed to delete announcement");
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      type: "info",
      isActive: true,
      expiresAt: "",
    });
    setEditingAnnouncement(null);
    setShowModal(false);
  };

  const getTypeColor = (type) => {
    const colors = {
      info: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-800 dark:text-blue-400",
        icon: "ℹ️",
        border: "border-blue-200 dark:border-blue-800"
      },
      warning: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-800 dark:text-yellow-400",
        icon: "⚠️",
        border: "border-yellow-200 dark:border-yellow-800"
      },
      success: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-400",
        icon: "✅",
        border: "border-green-200 dark:border-green-800"
      },
      error: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-800 dark:text-red-400",
        icon: "🚨",
        border: "border-red-200 dark:border-red-800"
      },
    };
    return colors[type] || colors.info;
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (user?.role !== "teacher") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 mb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 mb-4">
            <span className="text-2xl">📢</span>
            <span className="text-sm font-semibold text-gray-700">Teacher Announcements</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
            My Announcements
          </h1>
          <p className="text-lg text-gray-600">
            Create and manage announcements for students
          </p>
        </div>

        {/* Create Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Announcement
          </button>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-xl p-6 animate-pulse border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-2xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))
          ) : announcements.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-300">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                <span className="text-6xl">📢</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Announcements Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first announcement to notify students
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 mx-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Announcement
              </button>
            </div>
          ) : (
            announcements.map((announcement) => {
              const typeColor = getTypeColor(announcement.type);
              const expired = isExpired(announcement.expiresAt);

              return (
                <div
                  key={announcement._id}
                  className={`bg-white rounded-3xl shadow-xl border-2 p-6 transition-all hover:shadow-2xl ${
                    expired ? "opacity-60" : ""
                  } ${typeColor.border}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-16 h-16 ${typeColor.bg} rounded-2xl flex items-center justify-center text-3xl border-2 ${typeColor.border}`}>
                      {typeColor.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-black text-xl text-gray-900 mb-2">
                            {announcement.title}
                          </h3>
                          <p className="text-gray-700 leading-relaxed mb-3">
                            {announcement.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              announcement.isActive && !expired
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {expired ? "Expired" : announcement.isActive ? "Active" : "Inactive"}
                          </span>
                          <span className={`px-3 py-1 ${typeColor.bg} ${typeColor.text} rounded-full text-xs font-bold capitalize border ${typeColor.border}`}>
                            {announcement.type}
                          </span>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Created: {new Date(announcement.createdAt).toLocaleDateString()}
                        </span>
                        {announcement.expiresAt && (
                          <span className={`flex items-center gap-1 ${expired ? "text-red-600" : ""}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Expires: {new Date(announcement.expiresAt).toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(announcement._id, announcement.title)}
                          className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white mb-1">
                      {editingAnnouncement ? "Edit Announcement" : "New Announcement"}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Share important updates with students
                    </p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all hover:scale-110"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Title
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400"
                    placeholder="e.g., Important Class Update"
                    required
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Content
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400 resize-none"
                    rows="6"
                    placeholder="Enter announcement details..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Type */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Type
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 cursor-pointer"
                    >
                      <option value="info">ℹ️ Info</option>
                      <option value="warning">⚠️ Warning</option>
                      <option value="success">✅ Success</option>
                      <option value="error">🚨 Error</option>
                    </select>
                  </div>

                  {/* Expires At */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Expires At (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={form.expiresAt}
                      onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900"
                    />
                  </div>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold text-gray-700 cursor-pointer">
                    Active (visible to students)
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editingAnnouncement ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}