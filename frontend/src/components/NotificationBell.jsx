import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/users/notifications/all", { // Changed path
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications(res.data);
    setUnreadCount(res.data.filter(n => !n.read).length);
  } catch (err) {
    console.error("Fetch notifications error:", err);
    // Don't show error to user, just log it
    setNotifications([]);
    setUnreadCount(0);
  }
};

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/users/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.put(
        "/users/notifications/read-all",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (err) {
      console.error("Mark all as read error:", err);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    setShowDropdown(false);
    
    if (notification.type === "follow") {
      navigate(`/user/${notification.from._id}`);
    } else if (notification.project) {
      navigate(`/project/${notification.project._id}`);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffTime = Math.abs(now - notifDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes <= 1 ? "Just now" : `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return notifDate.toLocaleDateString();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return "❤️";
      case "comment":
        return "💬";
      case "follow":
        return "👤";
      case "upload":
        return "📤";
      default:
        return "🔔";
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-full focus:outline-0 text-stone-900 hover:text-stone-700 transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-96 bg-stone-900 rounded-sm shadow-2xl z-50 max-h-[500px] overflow-hidden flex flex-col border border-stone-700">
            {/* Header */}
            <div className="p-4 border-b border-stone-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-amber-500 hover:text-amber-600"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 border-b border-stone-700 hover:bg-gray-50 dark:hover:bg-stone-900 cursor-pointer transition-colors ${
                      !notif.read ? "bg-amber-50 bg-stone-800" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* User Avatar */}
                      <div className="flex-shrink-0">
                        {notif.from?.avatar ? (
                          <img
                            src={notif.from.avatar}
                            alt={notif.from.username}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                            {notif.from?.username?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm text-gray-900 dark:text-white">
                            <span className="font-semibold">
                              {notif.from?.username}
                            </span>{" "}
                            {notif.message}
                          </p>
                          <span className="text-2xl flex-shrink-0">
                            {getNotificationIcon(notif.type)}
                          </span>
                        </div>
                        
                        {/* Project Thumbnail */}
                        {notif.project?.thumbnail && (
                          <img
                            src={notif.project.thumbnail}
                            alt={notif.project.title}
                            className="mt-2 w-full h-20 object-cover rounded"
                          />
                        )}
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(notif.createdAt)}
                        </p>
                      </div>

                      {/* Unread Indicator */}
                      {!notif.read && (
                        <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-2">🔔</div>
                  <p>No notifications yet</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}