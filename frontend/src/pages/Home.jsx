import { useEffect, useState, useRef } from "react";
import { API } from "../api/api";
import ProjectCard from "../components/ProjectCard";
import CategorySidebar from "../components/CategorySidebar";
import FilterBar from "../components/FilterBar";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("random");
  const [dateRange, setDateRange] = useState("all");

  // ✅ Pagination state
  const [visibleCount, setVisibleCount] = useState(12); // Initially show 12 projects
  const [loading, setLoading] = useState(false);

  const shuffledProjectsRef = useRef(null);
  const lastSortRef = useRef("random");

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

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    API.get("/projects")
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => console.error("❌ Error fetching projects:", err));
  }, []);

  useEffect(() => {
    if (projects.length > 0 && sortBy === "random") {
      if (!shuffledProjectsRef.current || lastSortRef.current !== "random") {
        shuffledProjectsRef.current = shuffleArray(projects);
      }
    }
    lastSortRef.current = sortBy;
  }, [projects, sortBy]);

  useEffect(() => {
    if (projects.length === 0) return;

    let filtered = [...projects];

    if (sortBy === "random" && shuffledProjectsRef.current) {
      filtered = [...shuffledProjectsRef.current];
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) =>
        p.category.startsWith(selectedCategory)
      );
    }

    if (dateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateRange) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "3months":
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case "4months":
          filterDate.setMonth(now.getMonth() - 4);
          break;
        case "6months":
          filterDate.setMonth(now.getMonth() - 6);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter((p) => new Date(p.createdAt) >= filterDate);
    }

    if (sortBy !== "random") {
      switch (sortBy) {
        case "latest":
          filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        case "oldest":
          filtered.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          break;
        case "likes-high":
          filtered.sort(
            (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
          );
          break;
        case "likes-low":
          filtered.sort(
            (a, b) => (a.likes?.length || 0) - (b.likes?.length || 0)
          );
          break;
        case "views-high":
          filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
          break;
        case "views-low":
          filtered.sort((a, b) => (a.views || 0) - (b.views || 0));
          break;
        default:
          break;
      }
    }

    setFilteredProjects(filtered);
    
    // ✅ Reset visible count when filters change
    setVisibleCount(12);
  }, [projects, selectedCategory, sortBy, dateRange]);

  // ✅ Handle "See More" click
  const handleSeeMore = () => {
    setLoading(true);
    
    // Simulate loading delay for smooth UX
    setTimeout(() => {
      setVisibleCount((prev) => prev + 12); // Load 12 more projects
      setLoading(false);
    }, 500);
  };

  // ✅ Get visible projects
  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMoreProjects = visibleCount < filteredProjects.length;
  const remainingCount = filteredProjects.length - visibleCount;

  return (
    <div>
      {/* Hero Section - Hidden on mobile */}
      <div className="bg-gradient-to-b from-indigo-200/20 via-indigo-300/20 to-gray-100 py-16 sm:py-32 md:py-40 lg:py-52 px-4 md:px-6 text-center mb-6 md:mb-8 hidden sm:block">
        <h1 className="text-xl sm:text-4xl md:text-5xl lg:!text-7xl xl:text-7xl font-black mb-3 md:mb-4 text-stone-800">
          Discover Amazing Projects
        </h1>
        <p className="!text-2xl sm:text-lg md:text-xl max-w-2xl mx-auto text-blue-600">
          Explore a diverse collection of projects across various categories.
          Find inspiration, collaborate, and showcase your own work.
          <br />
          <span className="text-xs sm:text-sm text-stone-800">
            -Multimedia and Creative Technology
          </span>
        </p>
        <p className="text-3xl animate-bounce"></p>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop only */}
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          projects={projects}
        />

        {/* Main Content */}
        <div className="flex-1 px-3 md:px-6 pb-12 md:pb-20">
          {/* Filter Bar */}
          <FilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            dateRange={dateRange}
            setDateRange={setDateRange}
            projects={projects}
            filteredProjects={filteredProjects}
          />

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6 px-2 sm:px-4 md:px-8 lg:px-12">
                {visibleProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>

              {/* ✅ See More Button */}
              {hasMoreProjects && (
                <div className="flex flex-col items-center mt-8 md:mt-12">
                  {/* Progress indicator */}
                  <p className="text-xs md:text-sm text-stone-500 mb-3">
                    Showing {visibleProjects.length} of {filteredProjects.length} projects
                  </p>
                  
                  {/* See More Button */}
                  <button
                    onClick={handleSeeMore}
                    disabled={loading}
                    className="group flex items-center gap-2 bg-stone-800 hover:bg-stone-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-sm font-semibold text-sm md:text-base transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <span>See More</span>
                        <span className="bg-amber-500 text-stone-900 px-2 py-0.5 rounded-sm text-xs font-bold">
                          {remainingCount > 12 ? "12+" : remainingCount}
                        </span>
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-y-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* ✅ All Projects Loaded Message */}
              {!hasMoreProjects && filteredProjects.length > 12 && (
                <div className="flex flex-col items-center mt-8 md:mt-12">
                  <div className="flex items-center gap-2 text-stone-500 text-sm md:text-base">
                    <span>✅</span>
                    <span>All {filteredProjects.length} projects loaded</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 md:py-20">
              <div className="text-4xl md:text-6xl mb-3 md:mb-4">🔍</div>
              <h3 className="text-lg md:text-xl font-semibold text-stone-800 mb-2">
                No Projects Found
              </h3>
              <p className="text-sm md:text-base text-stone-700">
                Try adjusting your filters or check back later
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}