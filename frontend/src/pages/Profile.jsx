import { useEffect, useState } from "react";
import { API } from "../api/api";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
  const { user: currentUser } = useAuth();
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isOwnProfile = !userId || userId === currentUser?._id;
  const displayUser = isOwnProfile ? currentUser : profileUser;

  useEffect(() => {
    if (isOwnProfile && currentUser) {
      setProfileUser(currentUser);
      fetchProjects(currentUser._id);
    } else if (userId) {
      fetchUserProfile(userId);
      fetchProjects(userId);
    }
  }, [userId, currentUser, isOwnProfile]);

  const fetchUserProfile = async (id) => {
    try {
      setLoading(true);
      const response = await API.get(`/users/${id}`);
      setProfileUser(response.data);
      console.log("Fetched user profile:", response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async (id) => {
    try {
      const response = await API.get(`/projects/user/${id}`);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleDelete = async (projectId, projectTitle) => {
    if (!isOwnProfile) return;

    const isConfirmed = window.confirm(
      `⚠️ Delete Project?\n\n"${projectTitle}"\n\nThis action cannot be undone. Are you sure?`
    );

    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      await API.delete(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Project deleted successfully!");
      setProjects(projects.filter((p) => p._id !== projectId));
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error(err.response?.data?.message || "Failed to delete project");
    }
  };

  const handleEdit = (projectId) => {
    navigate(`/edit-project/${projectId}`);
  };

  const hasSocialLinks =
    displayUser?.socialLinks &&
    Object.values(displayUser.socialLinks).some(
      (link) => link && link.trim() !== ""
    );

  if (loading && !displayUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-base md:text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8">
      {/* User Info Card */}
      <div className="bg-stone-900 rounded-sm shadow-md p-4 md:p-6 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {displayUser?.avatar ? (
              <img
                src={displayUser.avatar}
                alt={displayUser.username}
                className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-sm object-cover border-4 border-stone-800"
              />
            ) : (
              <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-sm bg-stone-800 flex items-center justify-center text-stone-100 text-4xl md:text-5xl lg:text-7xl font-bold">
                {displayUser?.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left w-full">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 md:mb-4">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-stone-100 mb-1">
                  {displayUser?.username}
                </h2>
                <p className="text-sm md:text-base text-stone-300 break-all">
                  {displayUser?.email}
                </p>
                
                {displayUser?.designation && (
                  <p className="text-xs md:text-sm text-blue-600 font-semibold mb-1">
                    {displayUser.designation}
                  </p>
                )}
                
                {displayUser?.department && (
                  <p className="text-xs md:text-sm text-stone-300">
                    {displayUser.department}
                  </p>
                )}
              </div>

              {isOwnProfile && (
                <button
                  onClick={() => navigate("/settings")}
                  className="mt-3 md:mt-0 bg-blue-600 hover:bg-stone-800 text-stone-100 px-3 md:px-4 py-2 rounded-sm font-medium transition-colors flex items-center gap-2 mx-auto md:mx-0 text-sm md:text-base"
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </button>
              )}
            </div>

            {/* Bio */}
            <p className="text-stone-300 font-semibold text-xs md:text-sm mb-3 md:mb-4">
              <span className="text-stone-400 font-extrabold">Bio:</span>{" "}
              {displayUser?.bio || "No bio yet."}
            </p>

            {/* Social Links */}
            {hasSocialLinks ? (
              <div className="mb-3 md:mb-4">
                <p className="text-xs md:text-sm text-stone-500 mb-2 font-semibold">
                  Connect:
                </p>
                <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
                  {displayUser.socialLinks.linkedin && (
                    
                    <a href={displayUser.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-stone-800 hover:bg-stone-950 text-white rounded-sm text-xs md:text-sm transition-colors"
                    >
                      <span className="text-stone-200">LinkedIn</span>
                    </a>
                  )}
                  {displayUser.socialLinks.github && (
                    
                     <a href={displayUser.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-stone-800 hover:bg-stone-950 text-white rounded-sm text-xs md:text-sm transition-colors"
                    >
                      <span className="text-stone-200">GitHub</span>
                    </a>
                  )}
                  {displayUser.socialLinks.behance && (
                    
                     <a href={displayUser.socialLinks.behance}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-stone-800 hover:bg-stone-950 text-white rounded-sm text-xs md:text-sm transition-colors"
                    >
                      <span className="text-stone-200">Behance</span>
                    </a>
                  )}
                  {displayUser.socialLinks.portfolio && (
                    
                     <a href={displayUser.socialLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-stone-800 hover:bg-stone-950 text-white rounded-sm text-xs md:text-sm transition-colors"
                    >
                      <span className="text-stone-200">Portfolio</span>
                    </a>
                  )}
                  {displayUser.socialLinks.twitter && (
                    
                     <a href={displayUser.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-stone-800 hover:bg-stone-950 text-white rounded-sm text-xs md:text-sm transition-colors"
                    >
                      <span className="text-stone-200">Twitter</span>
                    </a>
                  )}
                  {displayUser.socialLinks.instagram && (
                    
                     <a href={displayUser.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-stone-800 hover:bg-stone-950 text-white rounded-sm text-xs md:text-sm transition-colors"
                    >
                      <span className="text-stone-200">Instagram</span>
                    </a>
                  )}
                  {displayUser.socialLinks.facebook && (
                    
                     <a href={displayUser.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-stone-800 hover:bg-stone-950 text-white rounded-sm text-xs md:text-sm transition-colors"
                    >
                      <span className="text-stone-200">Facebook</span>
                    </a>
                  )}
                </div>
              </div>
            ) : isOwnProfile ? (
              <div className="mb-3 md:mb-4 p-2 md:p-3 bg-stone-800 rounded-sm">
                <p className="text-xs md:text-sm text-stone-400 flex flex-wrap items-center gap-1 md:gap-2 justify-center md:justify-start">
                  <span>🔗</span>
                  <span>No social links added yet.</span>
                  <button
                    onClick={() => navigate("/settings")}
                    className="text-blue-600 hover:text-blue-500 underline"
                  >
                    Add links
                  </button>
                </p>
              </div>
            ) : null}

            {/* Student Details */}
            {(isOwnProfile || displayUser?.studentId) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm bg-stone-800 rounded-sm p-3 md:p-4">
                {displayUser.studentId && (
                  <div>
                    <span className="font-semibold text-stone-400">
                      Student ID:
                    </span>
                    <span className="ml-2 text-stone-100">
                      {displayUser.studentId}
                    </span>
                  </div>
                )}
                {displayUser.batch && (
                  <div>
                    <span className="font-semibold text-stone-400">Batch:</span>
                    <span className="ml-2 text-stone-100">{displayUser.batch}</span>
                  </div>
                )}
                {displayUser.batchAdvisor && (
                  <div>
                    <span className="font-semibold text-stone-400">
                      Advisor:
                    </span>
                    <span className="ml-2 text-white">
                      {displayUser.batchAdvisor}
                    </span>
                  </div>
                )}
                {displayUser.batchMentor && (
                  <div>
                    <span className="font-semibold text-stone-400">Mentor:</span>
                    <span className="ml-2 text-stone-100">
                      {displayUser.batchMentor}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
        {isOwnProfile ? "Your" : `${displayUser?.username}'s`} Projects (
        {projects.length})
      </h3>

      {projects.length > 0 ? (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 md:gap-4">
          {projects.map((p) => (
            <div key={p._id} className="break-inside-avoid mb-3 md:mb-4">
              <div className="relative group">
                <ProjectCard project={p} />

                {isOwnProfile && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleEdit(p._id);
                      }}
                      className="px-2 md:px-3 py-1.5 md:py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-sm shadow-lg transition-all"
                      title="Edit project"
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
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(p._id, p.title);
                      }}
                      className="bg-red-700 hover:bg-red-600 text-white px-2 md:px-3 py-1.5 md:py-2 rounded-sm shadow-lg transition-all"
                      title="Delete project"
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
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 md:py-12 bg-stone-900 rounded-sm">
          <p className="text-sm md:text-base text-stone-200 mb-3 md:mb-4">
            {isOwnProfile
              ? "You haven't uploaded any projects yet."
              : "No projects uploaded yet."}
          </p>
          {isOwnProfile && (
            <button
              onClick={() => navigate("/upload")}
              className="bg-blue-600 hover:bg-stone-800 text-white px-4 md:px-6 py-2 rounded-sm font-medium transition-colors text-sm md:text-base"
            >
              Upload Your First Project
            </button>
          )}
        </div>
      )}
    </div>
  );
}