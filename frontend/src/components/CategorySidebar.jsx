export default function CategorySidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  projects,
}) {
  return (
    <aside className="hidden lg:block w-48 xl:w-56 border-r border-gray-200 dark:border-gray-700 px-3 py-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <h3 className="text-base xl:text-lg font-bold text-gray-900 dark:text-white mb-4">
        Categories
      </h3>

      <ul className="space-y-1">
        {categories.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-sm xl:text-base text-left px-2 xl:px-3 py-1.5 xl:py-2 rounded-sm transition-all ${
                selectedCategory === cat
                  ? "bg-stone-800 text-stone-100 font-bold"
                  : "text-stone-700 hover:bg-stone-300"
              }`}
            >
              {cat}
              <span className="ml-2 text-xs xl:text-sm text-stone-500">
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