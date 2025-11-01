import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API } from "../api/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 🔥 Like states
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // 🔥 Project data fetch এবং view count increment
  useEffect(() => {
    // Fetch project data
    API.get(`/projects/${projectId}`)
      .then((res) => {
        console.log("📦 Project details:", res.data);
        setProject(res.data);
        setLikes(res.data.likes || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching project:", err);
        setLoading(false);
      });

    // Increment view count
    API.post(`/projects/${projectId}/view`)
      .then((res) => {
        console.log("👁️ View counted:", res.data.views);
      })
      .catch((err) => {
        console.error("Error incrementing view:", err);
      });
  }, [projectId]);

  // 🔥 Check like status
  useEffect(() => {
    if (user && projectId) {
      checkLikeStatus();
    }
  }, [user, projectId]);

  const checkLikeStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/projects/${projectId}/like-status`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setIsLiked(res.data.isLiked);
      setLikes(res.data.likes);
    } catch (err) {
      console.error("Error checking like status:", err);
    }
  };

  // 🔥 Handle like/unlike
  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like projects");
      return;
    }

    if (likeLoading) return;

    setLikeLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        `/projects/${projectId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setLikes(res.data.likes);
      setIsLiked(res.data.isLiked);
      
      // Toast notification
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
      setLikeLoading(false);
    }
  };

  // Next image
  const nextImage = () => {
    if (project.images && currentImageIndex < project.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // Previous image
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") navigate(-1);
    };
    
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentImageIndex, project]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Project not found</p>
        <button 
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:text-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-sm shadow-lg overflow-hidden">
          {/* Image Carousel Section */}
          {project.images && project.images.length > 0 && (
            <div className="relative bg-black">
              {/* Main Image Display */}
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <img
                  src={project.images[currentImageIndex]}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>

              {/* Previous Button */}
              {currentImageIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Next Button */}
              {currentImageIndex < project.images.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-sm text-sm">
                {currentImageIndex + 1} / {project.images.length}
              </div>

              {/* Thumbnail Navigation */}
              {project.images.length > 1 && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 p-2 rounded-sm max-w-full overflow-x-auto">
                  {project.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 rounded-sm overflow-hidden border-2 transition-all flex-shrink-0 ${
                        index === currentImageIndex
                          ? "border-amber-400 scale-110"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Project Details Section */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {project.title}
            </h1>

            {/* 🔥 Stats Row - Views, Likes, Date */}
            <div className="flex items-center gap-6 mb-6 text-sm text-gray-600 dark:text-gray-200">
              {/* Views */}
              <div className="flex items-center gap-2">
                <span className="text-xl">👁️</span>
                <span className="font-medium">{project.views || 0} views</span>
              </div>

              {/* Likes with button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  disabled={likeLoading}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-medium transition-all ${
                    isLiked
                      ? "bg-red-100 dark:bg-red-900/30 text-red-500"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
                  } ${likeLoading ? "opacity-50 cursor-not-allowed" : ""} ${!user ? "cursor-not-allowed opacity-70" : ""}`}
                  title={!user ? "Login to like" : isLiked ? "Unlike" : "Like"}
                >
                  <span className={`text-xl transition-transform ${isLiked ? "scale-110" : ""}`}>
                    {isLiked ? "❤️" : "🤍"}
                  </span>
                  <span className="font-medium">{likes} likes</span>
                </button>
              </div>

              {/* Upload Date */}
              <div className="flex items-center gap-2">
                <span className="text-xl">📅</span>
                <span className="font-medium">
                  {formatDate(project.createdAt)}
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="mb-6">
              <span className="text-sm font-medium text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-sm">
                {project.category}
              </span>
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {/* 🔥 Author Info - Clickable */}
            {project.userId && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Created by
                </h3>
                
                {/* 🔥 Author profile link - শুধু অন্যের profile এ link */}
                {user && user._id === project.userId._id ? (
                  // নিজের project হলে link নেই, শুধু info
                  <div className="flex items-center gap-3">
                    {project.userId.avatar ? (
                      <img
                        src={project.userId.avatar}
                        alt={project.userId.username}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold">
                        {project.userId.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {project.userId.username} <span className="text-xs text-gray-500">(You)</span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {project.userId.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  // অন্যের project হলে clickable link
                  <Link 
                    to={`/user/${project.userId._id}`}
                    className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-sm transition-colors group"
                  >
                    {project.userId.avatar ? (
                      <img
                        src={project.userId.avatar}
                        alt={project.userId.username}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold">
                        {project.userId.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">
                        {project.userId.username}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {project.userId.email}
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}