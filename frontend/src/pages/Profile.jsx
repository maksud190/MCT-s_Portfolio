

import { useEffect, useState } from "react";
import { API } from "../api/api";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Profile() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = () => {
    API.get(`/projects/user/${user._id}`)
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching user projects:", err));
  };

  const handleDelete = async (projectId, projectTitle) => {
    const isConfirmed = window.confirm(
      `⚠️ Delete Project?\n\n"${projectTitle}"\n\nThis action cannot be undone. Are you sure?`
    );

    if (!isConfirmed) return;

    const loadingToast = toast.loading("Deleting project...");

    try {
      await API.delete(`/projects/${projectId}`);
      toast.success("Project deleted successfully!", { id: loadingToast });
      setProjects(projects.filter((p) => p._id !== projectId));
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error(
        err.response?.data?.message || "Failed to delete project",
        { id: loadingToast }
      );
    }
  };

  const handleEdit = (projectId) => {
    navigate(`/edit/${projectId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* User Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-amber-400 flex items-center justify-center text-white text-4xl font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {user?.username}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>
              {/* Settings Button */}
              <button
                onClick={() => navigate("/profile/settings")}
                className="mt-4 md:mt-0 bg-amber-400 hover:bg-amber-400/80 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto md:mx-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
            </div>

            {/* Bio */}
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {user?.bio || "No bio yet."}
            </p>

            {/* Student Details - Only visible to owner */}
            {user?.studentId && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                {user.studentId && (
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Student ID:</span>
                    <span className="ml-2 text-gray-800 dark:text-white">{user.studentId}</span>
                  </div>
                )}
                {user.batch && (
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Batch:</span>
                    <span className="ml-2 text-gray-800 dark:text-white">{user.batch}</span>
                  </div>
                )}
                {user.batchAdvisor && (
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Advisor:</span>
                    <span className="ml-2 text-gray-800 dark:text-white">{user.batchAdvisor}</span>
                  </div>
                )}
                {user.batchMentor && (
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Mentor:</span>
                    <span className="ml-2 text-gray-800 dark:text-white">{user.batchMentor}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Your Projects ({projects.length})
      </h3>

      {projects.length > 0 ? (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {projects.map((p) => (
            <div key={p._id} className="break-inside-avoid mb-4">
              <div className="relative group">
                <ProjectCard project={p} />
                
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleEdit(p._id);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-lg transition-all"
                    title="Edit project"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(p._id, p.title);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg transition-all"
                    title="Delete project"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You haven't uploaded any projects yet.
          </p>
          <button
            onClick={() => navigate("/upload")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Upload Your First Project
          </button>
        </div>
      )}
    </div>
  );
}