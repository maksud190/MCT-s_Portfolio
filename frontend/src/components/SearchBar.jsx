import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/api";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Debounced search
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

  // ✅ Highlight matching text
  const highlightText = (text, query) => {
    if (!text || !query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={i}
              className="bg-amber-300 text-stone-900 px-0.5 rounded"
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

  // ✅ Determine match type for each result
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
          className="w-full px-2 py-1 pl-10 pr-4 border-gray-300 dark:border-gray-700 rounded-sm border-b-2 hover:border-b-stone-900 text-stone-900 focus:outline-none focus:border-stone-900 transition-all duration-200"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-800"
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
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-amber-400"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-slate-50 rounded-sm shadow-2xl max-h-96 overflow-y-auto border border-stone-700">
          {searchResults.map((project) => {
            const matchType = getMatchType(project);

            return (
              <div
                key={project._id}
                onClick={() => handleResultClick(project._id)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-slate-200 cursor-pointer transition-colors border-b border-stone-700 last:border-b-0"
              >
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-16 h-16 object-cover rounded-sm flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  {/* Project Title */}
                  <h4 className="font-semibold text-stone-900 line-clamp-1 m-0 p-0">
                    {highlightText(project.title, searchQuery)}
                  </h4>

                  {/* User Info */}
                  <p className="text-sm text-stone-700">
                    by {highlightText(project.userId?.username, searchQuery)}
                    {project.userId?.email && (
                      <span className="text-xs text-stone-500 ml-1">
                        ({highlightText(project.userId?.email, searchQuery)})
                      </span>
                    )}
                  </p>

                  {/* Match Type Badge & Stats */}
                  <div className="flex items-center gap-3 text-xs mt-1">
                    {matchType && (
                      <span className="bg-amber-400 text-stone-900 px-2 py-0.5 rounded text-xs font-medium">
                        Match: {matchType}
                      </span>
                    )}
                    <span className="text-stone-600">
                      👁️ {project.views || 0}
                    </span>
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
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-sm shadow-xl p-4 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              No projects found
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
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
