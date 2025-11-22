import { useState } from "react";
import { API } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function ContactModal({ targetUser, projectId, onClose }) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to send messages");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/users/contact",
        {
          toUserId: targetUser._id,
          message,
          projectId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Message sent successfully!");
      setMessage("");
      onClose();
    } catch (err) {
      console.error("Send message error:", err);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4 p-4 md:p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
            Contact {targetUser.username}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {targetUser.avatar ? (
            <img
              src={targetUser.avatar}
              alt={targetUser.username}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold text-base md:text-lg flex-shrink-0">
              {targetUser.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate">
              {targetUser.username}
            </p>
            {targetUser.isAvailableForHire && (
              <p className="text-xs md:text-sm text-green-600 dark:text-green-400 truncate">
                ✅ Available for hire
                {targetUser.hourlyRate && ` - ${targetUser.hourlyRate}/hr`}
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows="6"
              className="w-full p-2 md:p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400 resize-none text-sm md:text-base"
              disabled={loading}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm md:text-base"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="flex-1 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}