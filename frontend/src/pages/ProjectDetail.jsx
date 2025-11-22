import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Comments from "../components/Comments";
import ContactModal from "../components/ContactModal";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchProject();
    incrementView();
    checkLikeStatus();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const res = await API.get(`/projects/${projectId}`);
      setProject(res.data);
      setLikes(res.data.likes || 0);
    } catch (err) {
      console.error("Fetch project error:", err);
      toast.error("Failed to load project");
    }
  };

  const incrementView = async () => {
    try {
      await API.post(`/projects/${projectId}/view`);
    } catch (err) {
      console.error("View increment error:", err);
    }
  };

  const checkLikeStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await API.get(`/projects/${projectId}/like-status`, {
        headers,
      });
      setIsLiked(res.data.isLiked);
    } catch (err) {
      console.error("Check like status error:", err);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like projects");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        `/projects/${projectId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsLiked(res.data.isLiked);
      setLikes(res.data.likes);
      toast.success(res.data.message);
    } catch (err) {
      console.error("Like error:", err);
      toast.error("Failed to like project");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Project deleted successfully");
      navigate("/profile");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete project");
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
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-t-2 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  const isOwner = user && project.userId._id === user._id;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-4 lg:p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 md:mb-6 flex items-center gap-2 text-stone-700 hover:text-blue-600 transition-colors text-sm md:text-base"
      >
        <svg
          className="w-4 h-4 md:w-5 md:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back
      </button>

      <div>
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="rounded-sm overflow-hidden shadow-sm pt-4 md:pt-8 mb-4 md:mb-6 bg-stone-800">
            <div className="relative flex justify-center items-center">
              <img
                src={project.images[currentImageIndex]}
                alt={project.title}
                className="w-full h-60 sm:h-80 md:h-96 lg:h-120 object-contain bg-stone-800"
              />

              {/* Navigation Arrows */}
              {project.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? project.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 px-2 md:px-3 py-1 rounded-sm shadow-sm hover:bg-stone-700/70 transition-colors"
                  >
                    <svg
                      className="w-6 h-6 md:w-8 md:h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === project.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 px-2 md:px-3 py-1 rounded-sm shadow-sm hover:bg-stone-700/70 transition-colors"
                  >
                    <svg
                      className="w-6 h-6 md:w-8 md:h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 bg-black/90 text-white px-2 md:px-3 py-1 rounded-sm text-xs md:text-sm">
                {currentImageIndex + 1} / {project.images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {project.images.length > 1 && (
              <div className="p-3 md:p-4 flex gap-2 overflow-x-auto justify-center">
                {project.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx
                        ? "border-amber-400 scale-105"
                        : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${project.title} ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Info */}
          <div>
            <div className="flex items-start justify-between mb-3 md:mb-4 gap-2">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2 break-words">
                  {project.title}
                </h1>
                <span className="inline-block text-blue-600/90 text-xs md:text-sm italic break-words">
                  <span className="text-stone-600">Category: </span>
                  {project.category}
                </span>
              </div>

              {/* Owner Actions */}
              {isOwner && (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/edit-project/${projectId}`)}
                    className="p-1.5 md:p-2 text-blue-600 hover:text-stone-50 hover:bg-blue-600 rounded-sm transition-colors"
                    title="Edit"
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1.5 md:p-2 text-red-600 hover:text-stone-50 hover:bg-red-700 rounded-sm transition-colors"
                    title="Delete"
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <Link
              to={`/user/${project.userId._id}`}
              className="flex items-center mb-4 md:mb-6 gap-3 md:gap-4"
            >
              {project.userId.avatar ? (
                <img
                  src={project.userId.avatar}
                  alt={project.userId.username}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-sm border-4 border-stone-800"
                />
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-sm bg-stone-800 border-4 border-stone-800 text-white text-2xl md:text-3xl font-bold flex items-center justify-center">
                  {project.userId.username?.charAt(0).toUpperCase()}
                </div>
              )}

              <p className="text-base md:text-lg font-bold text-stone-800 hover:text-stone-600 transition-colors">
                {project.userId.username}
              </p>
            </Link>

            {/* Description */}
            <p className="text-sm md:text-base text-stone-800 mb-4 md:mb-6 whitespace-pre-wrap leading-relaxed bg-stone-200 py-3 px-4 md:px-5 rounded-sm font-semibold break-words">
              <span className="font-extrabold">Description:</span> <br />
              {project.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 md:gap-6 text-xs md:text-base text-stone-600 border-t border-gray-200 dark:border-gray-700 pt-3 md:pt-4 flex-wrap">
              <div className="flex items-center gap-1 md:gap-2">
                <span>👁️</span>
                <span>{project.views || 0} views</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <span>❤️</span>
                <span>{likes} likes</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <span>📅</span>
                <span>{formatDate(project.createdAt)}</span>
              </div>
            </div>

            {/* Like Button */}
            {!isOwner && (
              <button
                onClick={handleLike}
                className={`mt-3 md:mt-4 w-full py-2 md:py-3 rounded-sm font-medium transition-all text-sm md:text-base ${
                  isLiked
                    ? "bg-red-700 hover:bg-stone-500 text-stone-50"
                    : "dark:bg-stone-500 text-stone-50 hover:bg-red-700"
                }`}
              >
                {isLiked ? "♥️ Liked" : "🤍 Like"}
              </button>
            )}
          </div>

          {/* Comments Section */}
          <Comments projectId={projectId} />
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          targetUser={project.userId}
          projectId={projectId}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
}