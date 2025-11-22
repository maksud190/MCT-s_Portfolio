export default function CategorySidebar({ 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  projects 
}) {
  return (
    <div className="w-60 pt-7 mb-20 bg-gray-100 shadow-xl left-6 rounded-sm p-4 border-1 border-stone-400 sticky top-22 h-screen overflow-y-auto hidden lg:block">
      <h2 className="text-xl pb-4 font-bold mb-2 text-stone-900 border-b border-stone-700">
        Categories
      </h2>

      {/* 🔥 Categories List */}
      <ul className="space-y-0.5 space-x-0">
        {categories.map((cat) => (
          <li className="" key={cat}>
            <button
              onClick={() => setSelectedCategory(cat)}
              className={`w-full !text-sm text-left !px-1.5 !py-2 !rounded-sm transition-all ${
                selectedCategory === cat
                  ? "bg-stone-800 text-stone-100 font-bold"
                  : "text-stone-700 hover:bg-stone-300"
              }`}
            >
              {cat}
              
              {/* 🔥 Count badge */}
              <span
                className={`float-right !text-xs px-1.5 py-0.5 rounded-sm ${
                  selectedCategory === cat
                    ? "bg-stone-300 text-stone-900 font-semibold"
                    : "bg-stone-800/70 text-stone-100"
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
    </div>
  );
}