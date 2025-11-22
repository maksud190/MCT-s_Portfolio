import { useState, useEffect } from "react";
import { API } from "../api/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profiles() {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get("/users/all");
      setAllUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...allUsers];

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, filterRole, allUsers]);

  const teachers = filteredUsers.filter((user) => user.role === "teacher");
  const students = filteredUsers.filter((user) => user.role !== "teacher");

  const UserCard = ({ user }) => (
    <Link
      to={`/user/${user._id}`}
      className="hover:shadow-sm transition-all duration-300 overflow-hidden group bg-white rounded-sm shadow-md"
    >
      {/* Avatar */}
      <div className="flex items-center justify-center relative overflow-hidden p-6 md:p-8">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-20 h-20 md:w-24 md:h-24 rounded-sm object-cover border-4 border-stone-800 group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-sm bg-stone-800 border-4 border-stone-800 shadow-lg flex items-center justify-center text-white text-3xl md:text-4xl font-bold group-hover:scale-110 transition-transform duration-300">
            {user.username?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-3 md:px-4 pb-3 md:pb-4 text-center">
        <h3 className="text-base md:text-xl font-extrabold text-stone-800 mb-1 truncate">
          {user.username}
        </h3>

        {user.designation && (
          <p className="text-xs md:text-sm text-stone-700 font-semibold mb-1 md:mb-2 truncate">
            {user.designation}
          </p>
        )}

        {user.department && (
          <p className="text-xs text-stone-600 mb-1 truncate">
            {user.department}
          </p>
        )}

        {user.role !== "teacher" && (
          <div className="flex justify-center gap-2 md:gap-4 text-xs text-stone-600 flex-wrap">
            {user.batch && (
              <span className="flex items-center">
                Batch: {user.batch}
              </span>
            )}
            {user.studentId && (
              <span className="flex items-center">
                ID: {user.studentId}
              </span>
            )}
          </div>
        )}

        <div className="mt-2 md:mt-3 mb-2 md:mb-3 text-blue-600 text-xs md:text-sm font-semibold flex justify-center items-center gap-1 group-hover:gap-2 transition-all">
          View Profile
          <svg
            className="w-3 h-3 md:w-4 md:h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Loading profiles...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="py-8 md:py-12 lg:py-16 px-4 md:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 md:mb-4 text-stone-800">
          MCT Community
        </h1>
        <p className="text-sm sm:text-base md:text-xl max-w-2xl mx-auto text-blue-600">
          Meet our talented teachers and creative students
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 pb-6 md:pb-8">
        <div className="bg-gray-100 border border-stone-400 rounded-sm shadow-md py-3 md:py-4 px-4 md:px-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 md:h-5 md:w-5 text-stone-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 md:pl-10 pb-1.5 pt-1.5 pr-3 md:pr-4 text-sm md:text-base border-b-2 border-stone-800 rounded-sm bg-gray-100 text-stone-800"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="w-full md:w-48">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 md:px-4 py-1.5 text-sm md:text-base border-b-2 border-stone-800 rounded-sm bg-gray-100 text-stone-800 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="teacher">Teachers</option>
                <option value="student">Students</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-3 text-xs md:text-sm text-stone-700">
            Showing <span className="text-blue-600 font-semibold">{filteredUsers.length}</span> of{" "}
            <span className="text-blue-600 font-semibold">{allUsers.length}</span> profiles
          </div>
        </div>

        {/* Teachers Section */}
        {teachers.length > 0 && (
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900">
                Teachers & Instructors
              </h2>
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                {teachers.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
              {teachers.map((teacher) => (
                <UserCard key={teacher._id} user={teacher} />
              ))}
            </div>
          </div>
        )}

        {/* Students Section */}
        {students.length > 0 && (
          <div>
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900">Students</h2>
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                {students.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
              {students.map((student) => (
                <UserCard key={student._id} user={student} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 md:py-20">
            <div className="text-4xl md:text-6xl mb-3 md:mb-4">🔍</div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No profiles found
            </h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}