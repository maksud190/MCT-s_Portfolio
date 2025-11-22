export default function FilterBar({
  categories = [], // Default empty array
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  dateRange,
  setDateRange,
  projects = [], // Default empty array
  filteredProjects = [] // Default empty array
}) {
  return (
    <div className="mb-6 bg-gray-100 px-4 py-2.5 ml-5 rounded-sm shadow-md border-1 border-stone-400">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        
        {/* Mobile Category Dropdown */}
        <div className="w-full sm:w-auto lg:hidden">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-amber-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400 transition-colors cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat} (
                {cat === "All"
                  ? projects.length
                  : projects.filter((p) => p.category?.startsWith(cat)).length}
                )
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-stone-600 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            // className="w-full sm:w-52 p-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-amber-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400 transition-colors cursor-pointer"
            className="w-full sm:w-40 p-0.5 text-sm font-light  rounded-sm bg-stone-800 text-stone-100 transition-colors cursor-pointer"
          >
            <option value="random">🎲 Default</option>
            <option value="latest">📅 Latest First</option>
            <option value="oldest">📅 Oldest First</option>
            <option value="likes-high">❤️ Most Liked</option>
            <option value="likes-low">🤍 Least Liked</option>
            <option value="views-high">👁️ Most Viewed</option>
            <option value="views-low">👁️ Least Viewed</option>
          </select>
        </div>

        {/* Date Range Dropdown */}
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-stone-600 mb-2">
            Time Period
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full sm:w-40  p-0.5 text-sm font-light  rounded-sm bg-stone-800 text-stone-100 transition-colors cursor-pointer"
          >
            <option value="all">⏰ All Time</option>
            <option value="week">📆 Last Week</option>
            <option value="month">📆 Last Month</option>
            <option value="3months">📆 Last 3 Months</option>
            <option value="4months">📆 Last 4 Months</option>
            <option value="6months">📆 Last 6 Months</option>
            <option value="year">📆 Last Year</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-stone-500 font-light">
          Showing{" "}
          <span className="font-semibold text-blue-600">
            {filteredProjects.length}
          </span>{" "}
          {filteredProjects.length === 1 ? "project" : "projects"}
          {selectedCategory !== "All" && (
            <span>
              {" "}
              in <span className="font-light text-blue-600">{selectedCategory}</span>
            </span>
          )}
          {dateRange !== "all" && (
            <span>
              {" "}
              from{" "}
              <span className="font-semibold text-amber-400">
                {dateRange === "week" && "last week"}
                {dateRange === "month" && "last month"}
                {dateRange === "3months" && "last 3 months"}
                {dateRange === "4months" && "last 4 months"}
                {dateRange === "6months" && "last 6 months"}
                {dateRange === "year" && "last year"}
              </span>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}










