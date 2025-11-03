import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API } from "../api/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Comments from "../components/Comments";
import FollowButton from "../components/FollowButton";
import ContactModal from "../components/ContactModal";
import LazyImage from "../components/LazyImage";

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
      const res = await API.get(`/projects/${projectId}/like-status`, { headers });
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
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
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
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  const isOwner = user && project.userId._id === user._id;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="relative">
              <LazyImage
                src={project.images[currentImageIndex]}
                alt={project.title}
                className="w-full h-auto max-h-[600px] object-contain bg-gray-100 dark:bg-gray-900"
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === project.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {project.images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {project.images.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto">
                {project.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx
                        ? "border-amber-400 scale-105"
                        : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${project.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h1>
                <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-sm">
                  {project.category}
                </span>
              </div>

              {/* Owner Actions */}
              {isOwner && (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/edit-project/${projectId}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-wrap leading-relaxed">
              {project.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center gap-2">
                <span>👁️</span>
                <span>{project.views || 0} views</span>
              </div>
              <div className="flex items-center gap-2">
                <span>❤️</span>
                <span>{likes} likes</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>{formatDate(project.createdAt)}</span>
              </div>
            </div>

            {/* Like Button */}
            {!isOwner && (
              <button
                onClick={handleLike}
                className={`mt-4 w-full py-3 rounded-lg font-medium transition-all ${
                  isLiked
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {isLiked ? "❤️ Liked" : "🤍 Like"}
              </button>
            )}
          </div>

          {/* Comments Section */}
          <Comments projectId={projectId} />
        </div>

        {/* Sidebar - 1 column */}
        <div className="lg:col-span-1">
          {/* User Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg sticky top-20">
            <div className="text-center mb-4">
              <Link to={`/user/${project.userId._id}`}>
                {project.userId.avatar ? (
                  <img
                    src={project.userId.avatar}
                    alt={project.userId.username}
                    className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-amber-400 hover:border-amber-500 transition-colors"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-amber-400">
                    {project.userId.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
              <Link
                to={`/user/${project.userId._id}`}
                className="text-xl font-bold text-gray-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
              >
                {project.userId.username}
              </Link>
              {project.userId.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {project.userId.bio}
                </p>
              )}
            </div>

            {/* Follow Button */}
            {!isOwner && (
              <div className="mb-4">
                <FollowButton targetUserId={project.userId._id} />
              </div>
            )}

            {/* Contact Button */}
            {!isOwner && project.userId.isAvailableForHire && (
              <button
                onClick={() => setShowContactModal(true)}
                className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors mb-4"
              >
                💼 Hire Me
              </button>
            )}

            {/* Social Links */}
            {project.userId.socialLinks && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Connect
                </h3>
                <div className="space-y-2">
                  {project.userId.socialLinks.linkedin && (
                    
                    <a href={project.userId.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      🔗 LinkedIn
                    </a>
                  )}
                  {project.userId.socialLinks.github && (
                    
                    <a href={project.userId.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-300 hover:underline"
                    >
                      💻 GitHub
                    </a>
                  )}
                  {project.userId.socialLinks.behance && (
                    
                    <a href={project.userId.socialLinks.behance}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-500 dark:text-blue-400 hover:underline"
                    >
                      🎨 Behance
                    </a>
                  )}
                  {project.userId.socialLinks.portfolio && (
                    
                    <a href={project.userId.socialLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      🌐 Portfolio
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Collaborators (continued) */}
            {project.collaborators && project.collaborators.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Collaborators
                </h3>
                <div className="space-y-2">
                  {project.collaborators.map((collab) => (
                    <Link
                      key={collab.user._id}
                      to={`/user/${collab.user._id}`}
                      className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                    >
                      {collab.user.avatar ? (
                        <img
                          src={collab.user.avatar}
                          alt={collab.user.username}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                          {collab.user.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {collab.user.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {collab.role}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
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