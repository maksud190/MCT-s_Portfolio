import { useState, useEffect } from "react";
import { API } from "../api/api";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Messages() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const endpoint = activeTab === "inbox" ? "/contact/inbox" : "/contact/sent";
      
      const res = await API.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setMessages(res.data);
    } catch (err) {
      console.error("Fetch messages error:", err);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/contact/unread-count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error("Fetch unread count error:", err);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      await API.patch(`/contact/${messageId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      fetchMessages();
      fetchUnreadCount();
      toast.success("Message marked as read");
    } catch (err) {
      console.error("Mark as read error:", err);
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this message?")) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/contact/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      fetchMessages();
      fetchUnreadCount();
      toast.success("Message deleted");
    } catch (err) {
      console.error("Delete message error:", err);
      toast.error("Failed to delete message");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-1/2 -translate-x-1/2"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 mb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 mb-4">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">Messages</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
            Your Messages
          </h1>
          <p className="text-lg text-gray-600">
            Manage your conversations
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-6 p-2 flex gap-2">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "inbox"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <span>Inbox</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "sent"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Sent</span>
          </button>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((msg) => {
              const otherUser = activeTab === "inbox" ? msg.senderId : msg.recipientId;
              
              return (
                <div
                  key={msg._id}
                  className={`bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
                    !msg.isRead && activeTab === "inbox"
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <Link to={`/user/${otherUser._id}`}>
                          {otherUser.avatar ? (
                            <img
                              src={otherUser.avatar}
                              alt={otherUser.username}
                              className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200 hover:border-blue-500 transition-all"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xl font-bold flex items-center justify-center">
                              {otherUser.username?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/user/${otherUser._id}`}
                            className="font-bold text-gray-900 hover:text-blue-600 transition-colors block truncate"
                          >
                            {otherUser.username}
                          </Link>
                          <p className="text-sm text-gray-500">
                            {formatDate(msg.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!msg.isRead && activeTab === "inbox" && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                            New
                          </span>
                        )}
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Subject */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {msg.subject}
                    </h3>

                    {/* Message */}
                    <p className="text-gray-700 whitespace-pre-wrap mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                      {msg.message}
                    </p>

                    {/* Project Link */}
                    {msg.projectId && (
                      <Link
                        to={`/project/${msg.projectId._id}`}
                        className="inline-flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 rounded-xl transition-all mb-4"
                      >
                        <img
                          src={msg.projectId.thumbnail}
                          alt={msg.projectId.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 font-medium">Related Project</p>
                          <p className="text-sm font-semibold text-blue-700 truncate">
                            {msg.projectId.title}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    )}

                    {/* Mark as Read Button */}
                    {!msg.isRead && activeTab === "inbox" && (
                      <button
                        onClick={() => handleMarkAsRead(msg._id)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-300">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Messages
              </h3>
              <p className="text-gray-600">
                {activeTab === "inbox"
                  ? "You haven't received any messages yet"
                  : "You haven't sent any messages yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}