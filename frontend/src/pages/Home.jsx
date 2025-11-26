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
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Circles */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200/30 !rounded-sm blur-3xl"></div>
          <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        </div>

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 md:py-36 lg:py-30">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-sm font-semibold text-gray-700">
                MCT's Portfolio
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
              Discover Amazing
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Creative Projects
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore a diverse collection of projects across various
              categories.
              <br className="hidden sm:block" />
              Find inspiration, collaborate, and showcase your own work.
            </p>

            {/* Department Tag */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl font-medium text-sm">
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>Multimedia and Creative Technology</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#projects"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                <span>Explore Projects</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>

              <a
                href="/upload"
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-gray-200 hover:border-blue-300"
              >
                Upload Your Project
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-gray-900">
                  500+
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium mt-1">
                  Projects
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-gray-900">
                  200+
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium mt-1">
                  Creators
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-gray-900">
                  50K+
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium mt-1">
                  Views
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-20 sm:h-32"
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Modern Infinite Scroll Section */}
      <div className="py-16 bg-white overflow-hidden">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Tools & Technologies
          </h2>
          <p className="text-lg text-gray-600">
            Software and platforms used by our creative community
          </p>
        </div>

        {/* Left to Right Scroll */}
        <div className="relative mb-8">
          <div className="flex animate-scroll-left">
            {/* First Set */}
            <div className="flex gap-6 px-3">
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144946/photoshop_kv1f1t.png"
                  alt="Photoshop"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145547/illustrator_cjs8sc.png"
                  alt="Illustrator"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144965/3ds-max-_i2fgfn.png"
                  alt="3DS Max"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144975/autocad_gqrepv.png"
                  alt="AutoCAD"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145145/Flstudio_ewfhfk.png"
                  alt="FL Studio"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144984/zbrush_bhdbyj.png"
                  alt="ZBrush"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145134/Unity_lhjahc.png"
                  alt="Unity"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144935/premier_pro_gtp72l.png"
                  alt="Premiere Pro"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145374/realflow_etkfgz.png"
                  alt="RealFlow"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145155/Unreal_Engine_zaeupg.png"
                  alt="Unreal Engine"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145221/d5-render_d7mwvb.png"
                  alt="D5 Render"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145178/AE_xxselg.png"
                  alt="After Effects"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145210/maya_hww3pe.png"
                  alt="Maya"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145164/substance_painter_hmoze3.png"
                  alt="Substance Painter"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Duplicate Set for Seamless Loop */}
            <div className="flex gap-6 px-3">
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144946/photoshop_kv1f1t.png"
                  alt="Photoshop"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145547/illustrator_cjs8sc.png"
                  alt="Illustrator"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144965/3ds-max-_i2fgfn.png"
                  alt="3DS Max"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144975/autocad_gqrepv.png"
                  alt="AutoCAD"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145145/Flstudio_ewfhfk.png"
                  alt="FL Studio"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144984/zbrush_bhdbyj.png"
                  alt="ZBrush"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145134/Unity_lhjahc.png"
                  alt="Unity"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144935/premier_pro_gtp72l.png"
                  alt="Premiere Pro"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145374/realflow_etkfgz.png"
                  alt="RealFlow"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145155/Unreal_Engine_zaeupg.png"
                  alt="Unreal Engine"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145221/d5-render_d7mwvb.png"
                  alt="D5 Render"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145178/AE_xxselg.png"
                  alt="After Effects"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145210/maya_hww3pe.png"
                  alt="Maya"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145164/substance_painter_hmoze3.png"
                  alt="Substance Painter"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right to Left Scroll */}
        <div className="relative">
          <div className="flex animate-scroll-right">
            {/* First Set */}
            <div className="flex gap-6 px-3">
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144946/photoshop_kv1f1t.png"
                  alt="Photoshop"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145547/illustrator_cjs8sc.png"
                  alt="Illustrator"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144965/3ds-max-_i2fgfn.png"
                  alt="3DS Max"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144975/autocad_gqrepv.png"
                  alt="AutoCAD"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145145/Flstudio_ewfhfk.png"
                  alt="FL Studio"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144984/zbrush_bhdbyj.png"
                  alt="ZBrush"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145134/Unity_lhjahc.png"
                  alt="Unity"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144935/premier_pro_gtp72l.png"
                  alt="Premiere Pro"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145374/realflow_etkfgz.png"
                  alt="RealFlow"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145155/Unreal_Engine_zaeupg.png"
                  alt="Unreal Engine"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145221/d5-render_d7mwvb.png"
                  alt="D5 Render"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145178/AE_xxselg.png"
                  alt="After Effects"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145210/maya_hww3pe.png"
                  alt="Maya"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145164/substance_painter_hmoze3.png"
                  alt="Substance Painter"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Duplicate Set for Seamless Loop */}
            <div className="flex gap-6 px-3">
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144946/photoshop_kv1f1t.png"
                  alt="Photoshop"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145547/illustrator_cjs8sc.png"
                  alt="Illustrator"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144965/3ds-max-_i2fgfn.png"
                  alt="3DS Max"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144975/autocad_gqrepv.png"
                  alt="AutoCAD"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145145/Flstudio_ewfhfk.png"
                  alt="FL Studio"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144984/zbrush_bhdbyj.png"
                  alt="ZBrush"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145134/Unity_lhjahc.png"
                  alt="Unity"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764144935/premier_pro_gtp72l.png"
                  alt="Premiere Pro"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145374/realflow_etkfgz.png"
                  alt="RealFlow"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145155/Unreal_Engine_zaeupg.png"
                  alt="Unreal Engine"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145221/d5-render_d7mwvb.png"
                  alt="D5 Render"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145178/AE_xxselg.png"
                  alt="After Effects"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145210/maya_hww3pe.png"
                  alt="Maya"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/demcdzfpj/image/upload/v1764145164/substance_painter_hmoze3.png"
                  alt="Substance Painter"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-gradient-to-t from-gray-100 to-white">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6 px-2 sm:px-4 md:px-8 lg:px-12">
                {visibleProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>

              {/* ✅ See More Button */}
              {hasMoreProjects && (
                <div className="flex flex-col items-center mt-8 md:mt-12">
                  {/* Progress indicator */}
                  <p className="text-xs md:text-sm text-stone-500 mb-3">
                    Showing {visibleProjects.length} of{" "}
                    {filteredProjects.length} projects
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
