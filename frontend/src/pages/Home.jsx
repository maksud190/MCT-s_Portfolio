import { useEffect, useState } from "react";
import { API } from "../api/api";
import CategorySidebar from "../components/CategorySidebar";
import FilterBar from "../components/FilterBar";
import ProjectGrid from "../components/ProjectGrid";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [dateRange, setDateRange] = useState("all");

  // 🔥 Categories list
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
        setFilteredProjects(res.data);
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
          startDate = new Date(0);
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

  // 🔥 Clear all filters function
  const clearFilters = () => {
    setSelectedCategory("All");
    setDateRange("all");
    setSortBy("latest");
  };

  // 🔥 Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* 🔥 Left Sidebar - Category Filter (Desktop only) */}
      <CategorySidebar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        projects={projects}
      />

      {/* 🔥 Main Content Area */}
      <main className="flex-1 p-6">
        {/* 🔥 Filter Bar - Sort & Date Range */}
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

        {/* 🔥 Projects Grid with Masonry Layout */}
        <ProjectGrid
          filteredProjects={filteredProjects}
          selectedCategory={selectedCategory}
          clearFilters={clearFilters}
        />
      </main>
    </div>
  );
}