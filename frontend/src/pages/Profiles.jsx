import { useState, useEffect } from "react";
import { API } from "../api/api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Profiles() {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all"); // all, teacher, student

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

  // Filter users based on search and role
  useEffect(() => {
    let filtered = [...allUsers];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Role filter
    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, filterRole, allUsers]);

  // Separate teachers and students
  const teachers = filteredUsers.filter((user) => user.role === "teacher");
  const students = filteredUsers.filter((user) => user.role !== "teacher");

  const UserCard = ({ user }) => (
    <Link
      to={`/user/${user._id}`}
      className="hover:shadow-sm transition-all duration-300 overflow-hidden group "
    >
      {/* Avatar */}
      <div className="flex items-center justify-center relative overflow-hidden p-8">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-24 h-24 rounded-sm object-cover border-4 border-stone-800 group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-24 h-24 rounded-sm bg-stone-800 border-4 border-stone-800 shadow-lg flex items-center justify-center text-white text-4xl font-bold group-hover:scale-110 transition-transform duration-300">
            {user.username?.charAt(0).toUpperCase()}
          </div>
        )}

        {/*Role Badge */}
        {/* {user.role === "teacher" && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            Teacher
          </div>
        )} */}

        {/* Role Badge */}
        {/* {user.role !== "teacher" && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            Student
          </div>
        )} */}
      </div>

      {/* Info */}
      <div className="pl-2 pr-2 pb-2 text-center">
        {/* Name */}
        <h3 className="text-xl font-extrabold text-stone-800 mb-1">
          {user.username}
        </h3>

        {/* Designation */}
        {user.designation && (
          <p className="text-sm text-stone-700 font-semibold mb-2">
            {user.designation}
          </p>
        )}

        {/* Department */}
        {user.department && (
          <p className="text-xs text-stone-600 mb-1">
            {user.department}
          </p>
        )}

        {/* Student Info */}
        {user.role !== "teacher" && (
          <div className="flex justify-center gap-4 text-xs text-stone-600">
            {user.batch && (
              <span className="flex items-center ">
                
                Batch: {user.batch}
              </span>
            )}
            {user.studentId && (
              <span className="flex items-center ">
                ID: {user.studentId}
              </span>
            )}
          </div>
        )}

        {/* Bio Preview */}
        {/* {user.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">
            {user.bio}
          </p>
        )} */}

        {/* View Profile Link */}
        <div className="mt-3 mb-3 text-blue-600 text-sm font-semibold flex justify-center items-center  group-hover:gap-2 transition-all">
          View Profile
          <svg
            className="w-4 h-4"
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading profiles...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="py-16 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-stone-800">
          MCT Community
        </h1>
        <p className="text-xl max-w-2xl mx-auto text-blue-600">
          Meet our talented teachers and creative students
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="bg-gray-100 border-1 border-stone-400 rounded-sm shadow-md py-4 px-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-stone-600"
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
                  className="w-full pl-10 pb-1.5 pt-1.5 pr-4 border-b-2 border-stone-800 rounded-sm bg-gray-100 text-stone-800 "
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full md:w-48 px-4 py-1.5 border-b-2 border-stone-800 rounded-sm bg-gray-100 text-stone-800 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="teacher">Teachers</option>
                <option value="student">Students</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-3 text-sm text-stone-700">
            Showing <span className="text-blue-600">{filteredUsers.length}</span> of <span className="text-blue-600">{allUsers.length}</span> profiles
          </div>
        </div>

        {/* Teachers Section */}
        {teachers.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-bold text-stone-900">
                Teachers & Instructors
              </h2>
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                {teachers.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {teachers.map((teacher) => (
                <UserCard key={teacher._id} user={teacher} />
              ))}
            </div>
          </div>
        )}

        {/* Students Section */}
        {students.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-bold text-stone-900">Students</h2>
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                {students.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {students.map((student) => (
                <UserCard key={student._id} user={student} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No profiles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
