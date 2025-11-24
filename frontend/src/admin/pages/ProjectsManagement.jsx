import { useState, useEffect } from "react";
import { API } from "../../api/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function ProjectsManagement() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProjects();
  }, [currentPage, approvalFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/projects", {
        params: {
          page: currentPage,
          limit: 20,
          search: searchQuery,
          isApproved: approvalFilter,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects(res.data.projects);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching projects:", err);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProjects();
  };

  const handleApproveProject = async (projectId, currentStatus) => {
    const action = currentStatus ? "reject" : "approve";
    if (
      !window.confirm(
        `${action.charAt(0).toUpperCase() + action.slice(1)} this project?`
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/admin/projects/${projectId}/approve`,
        { isApproved: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Project ${action}d successfully`);
      fetchProjects();
    } catch (err) {
      console.error("Error updating project:", err);
      toast.error(`Failed to ${action} project`);
    }
  };

  const handleToggleFeatured = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/admin/projects/${projectId}/featured`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Project featured status updated");
      fetchProjects();
    } catch (err) {
      console.error("Error toggling featured:", err);
      toast.error("Failed to update featured status");
    }
  };

  const handleDeleteProject = async (projectId, title) => {
    if (
      !window.confirm(
        `⚠️ Delete project "${title}"?\n\nThis will also delete all comments. This action cannot be undone.`
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/admin/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="!text-3xl md:text-3xl font-bold text-stone-800 dark:text-stone-100">
            Projects Management
          </h1>
          <p className="text-stone-600 dark:text-stone-400 font-medium mt-0">
            Manage and moderate all projects
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-stone-800 rounded-sm shadow p-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-sm bg-white dark:bg-stone-900 text-gray-900 dark:text-stone-100"
            />
          </div>
          <select
            value={approvalFilter}
            onChange={(e) => {
              setApprovalFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 !py-1.5 border border-stone-300 dark:border-stone-700 rounded-sm bg-white dark:bg-stone-900 text-gray-900 dark:text-white"
          >
            <option value="">All Projects</option>
            <option value="true">Approved</option>
            <option value="false">Pending</option>
          </select>
          <button
            type="submit"
            className="px-6 !py-1.5 bg-blue-600 hover:bg-stone-900 text-white !rounded-sm font-medium transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {loading ? (
          // Loading skeleton
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 !rounded-sm shadow overflow-hidden animate-pulse"
            >
              <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))
        ) : projects.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            No projects found
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-white dark:bg-gray-800/50 rounded-sm shadow overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-40 object-cover"
                />

                {/* Featured Badge */}
                {project.isFeatured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-3 py-1 rounded-sm text-xs font-bold flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  {project.isApproved ? (
                    <span className="bg-green-500/70 text-white px-2 py-1 rounded-sm text-xs font-medium">
                      ✓ Approved
                    </span>
                  ) : (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-sm text-xs font-medium">
                      ⏳ Pending
                    </span>
                  )}
                </div>

                {/* Stats Overlay */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-3 bg-stone-800/40 backdrop-blur-sm px-1.5 py-1 rounded-sm">
                    <span className="flex items-center gap-1">
                      👁️ {project.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      ❤️ {project.likes || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                  {project.title}
                </h3>

                <div className="flex items-center gap-2 mb-1">
                  {project.userId?.avatar ? (
                    <img
                      src={project.userId.avatar}
                      alt={project.userId.username}
                      className="w-6 h-6 rounded-sm object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-sm bg-stone-900 border-1 border-stone-300 flex items-center justify-center text-xs font-bold text-stone-100">
                      {project.userId?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-stone-700 dark:text-stone-300">
                    {project.userId?.username}
                  </span>
                </div>

                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {project.category}
                </p>

                <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-4">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/project/${project._id}`}
                    target="_blank"
                    className=" bg-blue-600 hover:bg-blue-700 !text-white !text-sm rounded-sm !font-sm transition-colors !pt-2 px-2"
                  >
                    View
                  </Link>

                  <button
                    onClick={() =>
                      handleApproveProject(project._id, project.isApproved)
                    }
                    className={`flex-1 !px-0 !py-0 !text-sm !rounded-sm !font-sm transition-colors ${
                      project.isApproved
                        ? "bg-red-200 text-red-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {project.isApproved ? "Reject" : "Approve"}
                  </button>

                  <button
                    onClick={() => handleToggleFeatured(project._id)}
                    className={`!p-2 !rounded-sm transition-colors ${
                      project.isFeatured
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                    title={
                      project.isFeatured ? "Remove featured" : "Make featured"
                    }
                  >
                    <svg
                      className="w-5 h-5 "
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteProject(project._id, project.title)
                    }
                    className="!p-2 bg-red-200 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 !rounded-sm transition-colors"
                    title="Delete project"
                  >
                    <svg
                      className="w-5 h-5"
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
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white dark:bg-gray-800 !rounded-sm shadow px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
