import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/api";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const res = await API.get(`/projects/search/projects?q=${searchQuery}`);
      setSearchResults(res.data);
      setShowResults(true);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (projectId) => {
    setShowResults(false);
    setSearchQuery("");
    navigate(`/project/${projectId}`);
  };

  const highlightText = (text, query) => {
    if (!text || !query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={i}
              className="bg-blue-300 text-stone-800 px-0.5 rounded-sm"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  const getMatchType = (project) => {
    const query = searchQuery.toLowerCase();
    const title = project.title?.toLowerCase() || "";
    const username = project.userId?.username?.toLowerCase() || "";
    const email = project.userId?.email?.toLowerCase() || "";
    const category = project.category?.toLowerCase() || "";

    if (title.includes(query)) return "Title";
    if (username.includes(query)) return "Username";
    if (email.includes(query)) return "Email";
    if (category.includes(query)) return "Category";
    return "";
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by title, username, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2 py-1 pl-8 md:pl-10 pr-4 border-stone-800 rounded-sm border-b-2 hover:border-b-stone-900 text-stone-900 focus:outline-none focus:border-stone-900 transition-all duration-200 text-sm md:text-base"
        />
        <svg
          className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-stone-800"
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
        {isSearching && (
          <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-stone-50 rounded-sm shadow-2xl max-h-[60vh] md:max-h-96 overflow-y-auto border border-stone-700">
          {searchResults.map((project) => {
            const matchType = getMatchType(project);

            return (
              <div
                key={project._id}
                onClick={() => handleResultClick(project._id)}
                className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 hover:bg-stone-100 cursor-pointer transition-colors border-b border-stone-700 last:border-b-0"
              >
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-sm flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  {/* Project Title */}
                  <h4 className="font-semibold text-stone-900 line-clamp-1 m-0 p-0 text-xs md:text-sm">
                    {highlightText(project.title, searchQuery)}
                  </h4>

                  {/* User Info */}
                  <p className="text-xs md:text-sm text-stone-700">
                    <span className="font-medium">by</span>{" "}
                    {highlightText(project.userId?.username, searchQuery)}
                    {project.userId?.email && (
                      <span className="text-xs text-stone-500 ml-1 hidden sm:inline">
                        ({highlightText(project.userId?.email, searchQuery)})
                      </span>
                    )}
                  </p>

                  {/* Match Type Badge & Stats */}
                  <div className="flex items-center gap-2 md:gap-3 text-xs mt-1">
                    {matchType && (
                      <span className="bg-amber-400 text-stone-900 px-1 py-0.5 rounded-sm text-xs font-medium">
                        {matchType}
                      </span>
                    )}
                    <span className="text-stone-600">👁️ {project.views || 0}</span>
                    <span className="text-stone-600">
                      ❤️ {project.likes?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {showResults &&
        searchQuery.length >= 2 &&
        searchResults.length === 0 &&
        !isSearching && (
          <div className="absolute z-50 w-full mt-2 bg-stone-50 rounded-sm shadow-xl p-3 md:p-4 text-center border border-stone-700">
            <div className="text-2xl md:text-4xl mb-2">🔍</div>
            <p className="text-stone-700 font-medium text-sm md:text-base">
              No projects found
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Try searching by project title, username, or email
            </p>
          </div>
        )}

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        ></div>
      )}
    </div>
  );
}