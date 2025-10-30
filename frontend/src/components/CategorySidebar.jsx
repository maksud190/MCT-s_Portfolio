export default function CategorySidebar({ 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  projects 
}) {
  return (
    <aside className="w-63 bg-black dark:bg-white p-4 border-r border-gray-200 dark:border-gray-700 sticky top-16 h-screen overflow-y-auto hidden lg:block">
      <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-black">
        Categories
      </h2>

      {/* 🔥 Categories List */}
      <ul className="space-y-0.5 space-x-0">
        {categories.map((cat) => (
          <li className="" key={cat}>
            <button
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-2 !py-2 !rounded-sm transition-all ${
                selectedCategory === cat
                  ? "bg-amber-400 text-white font-semibold"
                  : "text-gray-700 dark:text-blue-950 hover:bg-gray-100 dark:hover:bg-amber-200"
              }`}
            >
              {cat}
              
              {/* 🔥 Count badge */}
              <span
                className={`float-right text-xs px-1.5 py-0.5 rounded-sm ${
                  selectedCategory === cat
                    ? "bg-white text-gray-900 font-semibold"
                    : "bg-gray-200 dark:bg-gray-600/80 text-gray-700 dark:text-gray-300"
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
    </aside>
  );
}