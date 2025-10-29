// import { useEffect, useState } from "react";
// import { API } from "../api/api";
// import ProjectCard from "../components/ProjectCard";

// export default function Home() {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     API.get("/projects")
//       .then((res) => {
//         console.log("📦 Fetched projects:", res.data);
//         setProjects(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("❌ Error fetching projects:", err);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (projects.length === 0) {
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen">
//         <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">No projects found</p>
//         <p className="text-sm text-gray-500 dark:text-gray-500">Upload some projects to get started!</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-10 mx-20">
//       {/* 🔥 Pinterest style masonry layout */}
//       <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-6 gap-4 space-y-4">
//         {projects.map((p) => (
//           <ProjectCard key={p._id} project={p} />
//         ))}
//       </div>
//     </div>
//   );

// }

import { useEffect, useState } from "react";
import { API } from "../api/api";
import ProjectCard from "../components/ProjectCard";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest"); // latest, likes-high, likes-low
  const [dateRange, setDateRange] = useState("all"); // all, week, month, 3months, 6months, year

  // 🔥 All categories list
  // const categories = [
  //   "All",
  //   "Web Development",
  //   "Mobile Apps",
  //   "Graphics Design",
  //   "Photography",
  //   "Video Production",
  //   "Writing",
  //   "Art",
  //   "Music"
  // ];

  const categories = [
    "All",
    "3d",
    "Art",
    "Branding",
    "Web Development",
    "Game Development",
    "Graphics Design",
    "Mobile Apps",
    "Music",
    "Photography",
    "Video Production",
    "Writing",
  ];

  // 🔥 Projects fetch করা
  useEffect(() => {
    API.get("/projects")
      .then((res) => {
        console.log("📦 Fetched projects:", res.data);
        setProjects(res.data);
        setFilteredProjects(res.data); // Initially সব projects
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching projects:", err);
        setLoading(false);
      });
  }, []);

  // 🔥 Filter, Sort এবং Date Range apply করা
  useEffect(() => {
    let result = [...projects];

    // 🔥 Category filter
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category.startsWith(selectedCategory));
    }

    // 🔥 Date range filter
    if (dateRange !== "all") {
      const now = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "3months":
          startDate.setMonth(now.getMonth() - 3);
          break;
        case "6months":
          startDate.setMonth(now.getMonth() - 6);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate = new Date(0); // All time
      }

      result = result.filter((p) => new Date(p.createdAt) >= startDate);
    }

    // 🔥 Sorting
    switch (sortBy) {
      case "latest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "likes-high":
        result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "likes-low":
        result.sort((a, b) => (a.likes || 0) - (b.likes || 0));
        break;
      default:
        break;
    }

    setFilteredProjects(result);
  }, [projects, selectedCategory, sortBy, dateRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* 🔥 Left Sidebar - Category Filter */}
      <aside className="w-64 bg-white dark:bg-gray-800 p-6 border-r border-gray-200 dark:border-gray-700 sticky top-16 h-screen overflow-y-auto hidden lg:block">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Categories
        </h2>

        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-500 text-white font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {cat}
                {/* 🔥 Count badge */}
                <span
                  className={`float-right text-xs px-2 py-1 rounded-full ${
                    selectedCategory === cat
                      ? "bg-white text-blue-500"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {cat === "All"
                    ? projects.length
                    : projects.filter((p) => p.category.startsWith(cat)).length}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* 🔥 Active filters info */}
        {(selectedCategory !== "All" ||
          dateRange !== "all" ||
          sortBy !== "latest") && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setSelectedCategory("All");
                setDateRange("all");
                setSortBy("latest");
              }}
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </aside>

      {/* 🔥 Main Content Area */}
      <main className="flex-1 p-6">
        {/* 🔥 Top Bar - Sort & Date Range */}
        <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* 🔥 Mobile Category Dropdown */}
            <div className="w-full sm:w-auto lg:hidden">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} (
                    {cat === "All"
                      ? projects.length
                      : projects.filter((p) => p.category.startsWith(cat))
                          .length}
                    )
                  </option>
                ))}
              </select>
            </div>

            {/* 🔥 Sort Dropdown */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-48 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
              >
                <option value="latest">Latest First</option>
                <option value="likes-high">Most Liked</option>
                <option value="likes-low">Least Liked</option>
              </select>
            </div>

            {/* 🔥 Date Range Dropdown */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Period
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full sm:w-48 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>

          {/* 🔥 Results count */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-blue-500">
                {filteredProjects.length}
              </span>{" "}
              {filteredProjects.length === 1 ? "project" : "projects"}
              {selectedCategory !== "All" && (
                <span>
                  {" "}
                  in <span className="font-semibold">{selectedCategory}</span>
                </span>
              )}
              {dateRange !== "all" && (
                <span>
                  {" "}
                  from{" "}
                  <span className="font-semibold">
                    {dateRange === "week" && "last week"}
                    {dateRange === "month" && "last month"}
                    {dateRange === "3months" && "last 3 months"}
                    {dateRange === "6months" && "last 6 months"}
                    {dateRange === "year" && "last year"}
                  </span>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* 🔥 Projects Grid - Masonry Layout */}
        {filteredProjects.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {filteredProjects.map((p) => (
              <div key={p._id} className="break-inside-avoid mb-4">
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        ) : (
          // 🔥 No results message
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
              {selectedCategory !== "All"
                ? `No projects in "${selectedCategory}" category with the selected filters.`
                : "No projects match your selected filters."}
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setDateRange("all");
                setSortBy("latest");
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
