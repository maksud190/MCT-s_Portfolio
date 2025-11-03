import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API } from "../api/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ProjectCard({ project }) {
  const [likes, setLikes] = useState(project.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Check like status
  useEffect(() => {
    if (user) {
      checkLikeStatus();  
    }
  }, [user, project._id]);

  const checkLikeStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/projects/${project._id}/like-status`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setIsLiked(res.data.isLiked);
      setLikes(res.data.likes);
    } catch (err) {
      console.error("Error checking like status:", err);
    }
  };

  // Handle like
  const handleLike = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to like projects");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        `/projects/${project._id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setLikes(res.data.likes);
      setIsLiked(res.data.isLiked);
      
      if (res.data.isLiked) {
        toast.success("Liked! ❤️", { duration: 2000 });
      } else {
        toast.success("Unliked", { duration: 2000 });
      }
    } catch (err) {
      console.error("Error liking project:", err);
      
      if (err.response?.status === 401) {
        toast.error("Please login to like projects");
      } else {
        toast.error(err.response?.data?.message || "Failed to like project");
      }
    } finally {
      setLoading(false);
    }
  };

  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes <= 1 ? "Just now" : `${diffMinutes}m ago`;
      }
      return diffHours === 1 ? "1h ago" : `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? "1w ago" : `${weeks}w ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? "1mo ago" : `${months}mo ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return years === 1 ? "1y ago" : `${years}y ago`;
    }
  };

  return (
    <Link to={`/project/${project._id}`} className="block group">
      <div className="bg-white dark:bg-stone-800 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        {/* Image Section */}
        <div className="relative overflow-hidden bg-gray-200 dark:bg-gray-700">
          {project.thumbnail && !imageError ? (
            <>
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={() => setImageError(true)}
              />
              
              {/* Image count badge */}
              {project.images && project.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-gray-950/40 text-white text-xs px-2 py-1 rounded-sm flex justify-center items-center gap-1">
                  <span className="pb-1">📷</span>
                  <span>{project.images.length}</span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-64 flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">No Image</p>
            </div>
          )}
          
          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
        </div>

        {/* Content Section */}
        <div className="px-4 py-2.5">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1.5 line-clamp-2">
            {project.title}
          </h3>

          {/* Stats Row - Views, Comments, Date */}
          <div className="flex items-center justify-between text-xs font-light text-gray-500 dark:text-gray-400 mb-1.5">
            {/* Views */}
            <div className="flex items-center gap-1">
              <span>👁️</span>
              <span>{project.views || 0}</span>
            </div>

            {/* ✅ Comments - Use .length for array */}
            <div className="flex items-center gap-1">
              <span>💬</span>
              <span>{project.comments?.length || 0}</span>
            </div>

            {/* Upload Date */}
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span>{formatDate(project.createdAt)}</span>
            </div>
          </div>

          {/* Footer with category and like button */}
          <div className="flex items-center justify-between">
            <span className="text-xs rounded-sm font-extralight text-blue-200 dark:text-amber-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1">
              {project.category}
            </span>

            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={loading || !user}
              className={`flex items-center gap-1 px-2 py-1 rounded-sm text-sm font-medium transition-all ${
                isLiked
                  ? "bg-red-100 dark:bg-red-900/30 text-red-500"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""} ${!user ? "cursor-not-allowed opacity-70" : ""}`}
              title={!user ? "Login to like" : isLiked ? "Unlike" : "Like"}
            >
              <span className={`text-base transition-transform ${isLiked ? "scale-110" : ""}`}>
                {isLiked ? "❤️" : "🤍"}
              </span>
              <span>{likes}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}