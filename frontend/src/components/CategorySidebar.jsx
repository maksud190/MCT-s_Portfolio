// export default function CategorySidebar({
//   categories,
//   selectedCategory,
//   setSelectedCategory,
//   projects,
// }) {
//   return (
//     <aside className="hidden lg:block w-48 xl:w-56 px-3 py-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
//       <h3 className="text-base xl:text-lg font-bold text-stone-800 mb-4">
//         Categories
//       </h3>

//       <ul className="space-y-1 pr-2 border-r-2 border-stone-400">
//         {categories.map((cat) => (
//           <li key={cat}>
//             <button
//               onClick={() => setSelectedCategory(cat)}
//               className={`w-full text-sm xl:text-base text-left px-2 xl:px-3 !py-2 !xl:py-2 !rounded-sm transition-all ${
//                 selectedCategory === cat
//                   ? "bg-stone-800 text-stone-100 font-bold"
//                   : "text-stone-700 hover:bg-stone-300"
//               }`}
//             >
//               {cat}
//               <span className="ml-2 text-xs xl:text-sm text-stone-500">
//                 {cat === "All"
//                   ? projects.length
//                   : projects.filter((p) => p.category.startsWith(cat)).length}
//               </span>
//             </button>
//           </li>
//         ))}
//       </ul>
//     </aside>
//   );
// }













export default function CategorySidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  projects,
}) {
  return (
    <aside className="hidden lg:block w-64 xl:w-72 px-6 sticky top-20 h-[calc(100vh)] overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Categories
        </h3>
        <p className="text-sm text-gray-500">
          Filter projects by category
        </p>
      </div>

      {/* Category List */}
      <ul className="space-y-2">
        {categories.map((cat) => {
          const count = cat === "All"
            ? projects.length
            : projects.filter((p) => p.category?.startsWith(cat)).length;
          
          const isActive = selectedCategory === cat;

          return (
            <li key={cat}>
              <button
                onClick={() => setSelectedCategory(cat)}
                className={`group w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:shadow-md hover:scale-102 border border-gray-200"
                }`}
              >
                <span className={`font-semibold text-sm xl:text-base ${
                  isActive ? "text-white" : "text-gray-900"
                }`}>
                  {cat}
                </span>
                
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                }`}>
                  {count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Bottom Info */}
      <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="font-semibold text-gray-900 text-sm">
            Quick Tip
          </h4>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          Browse different categories to discover amazing creative projects from MCT students
        </p>
      </div>
    </aside>
  );
}