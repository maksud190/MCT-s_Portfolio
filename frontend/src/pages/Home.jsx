import { useEffect, useState } from "react";
import { API } from "../api/api";
import ProjectCard from "../components/ProjectCard";
import CategorySidebar from "../components/CategorySidebar";
import FilterBar from "../components/FilterBar";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("random"); // 🔥 Default to random
  const [dateRange, setDateRange] = useState("all");

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

  useEffect(() => {
    API.get("/projects")
      .then((res) => {
        setProjects(res.data);
        setFilteredProjects(res.data);
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  // 🔥 Shuffle function for random sort
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 🔥 Filter and sort projects
  useEffect(() => {
    let filtered = [...projects];

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) =>
        p.category.startsWith(selectedCategory)
      );
    }

    // Date range filter
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

      filtered = filtered.filter(
        (p) => new Date(p.createdAt) >= filterDate
      );
    }

    // 🔥 Sort projects (including random)
    switch (sortBy) {
      case "random":
        filtered = shuffleArray(filtered);
        break;
      case "latest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "likes-high":
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "likes-low":
        filtered.sort((a, b) => (a.likes || 0) - (b.likes || 0));
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

    setFilteredProjects(filtered);
  }, [projects, selectedCategory, sortBy, dateRange]);

  return (
    <div className="flex">
      {/* Sidebar - Desktop only */}
      <CategorySidebar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        projects={projects}
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
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
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-6 gap-2">
            {filteredProjects.map((project) => (
              <div key={project._id} className="break-inside-avoid mb-4">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Projects Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or check back later
            </p>
          </div>
        )}
      </div>
    </div>
  );
}