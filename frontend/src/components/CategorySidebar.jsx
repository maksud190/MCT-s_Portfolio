// export default function CategorySidebar({
//   categories,
//   selectedCategory,
//   setSelectedCategory,
//   projects,
// }) {
//   return (
//     <aside className="hidden lg:block w-64 xl:w-72 px-6 sticky top-20 h-[calc(100vh)] overflow-y-auto">
//       {/* Header */}
//       <div className="mb-6">
//         <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
//           <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
//           </svg>
//           Categories
//         </h3>
//         <p className="text-sm text-gray-500">
//           Filter projects by category
//         </p>
//       </div>

//       {/* Category List */}
//       <ul className="space-y-2">
//         {categories.map((cat) => {
//           const count = cat === "All"
//             ? projects.length
//             : projects.filter((p) => p.category?.startsWith(cat)).length;
          
//           const isActive = selectedCategory === cat;

//           return (
//             <li key={cat}>
//               <button
//                 onClick={() => setSelectedCategory(cat)}
//                 className={`group w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between ${
//                   isActive
//                     ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
//                     : "bg-white text-gray-700 hover:bg-blue-50 hover:shadow-md hover:scale-102 border border-gray-200"
//                 }`}
//               >
//                 <span className={`font-semibold text-sm xl:text-base ${
//                   isActive ? "text-white" : "text-gray-900"
//                 }`}>
//                   {cat}
//                 </span>
                
//                 <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
//                   isActive
//                     ? "bg-white/20 text-white"
//                     : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
//                 }`}>
//                   {count}
//                 </span>
//               </button>
//             </li>
//           );
//         })}
//       </ul>

//       {/* Bottom Info */}
//       <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
//         <div className="flex items-center gap-2 mb-2">
//           <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <h4 className="font-semibold text-gray-900 text-sm">
//             Quick Tip
//           </h4>
//         </div>
//         <p className="text-xs text-gray-600 leading-relaxed">
//           Browse different categories to discover amazing creative projects from MCT students
//         </p>
//       </div>
//     </aside>
//   );
// }























// components/CategorySidebar.jsx - UPDATE

import { useState, useEffect } from "react";
import { API } from "../api/api";

export default function CategorySidebar({ selectedCategory, setSelectedCategory, projects }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryCount = (categoryName) => {
    if (categoryName === "All") return projects.length;
    return projects.filter((p) => p.category.startsWith(categoryName)).length;
  };

  return (
    <div className="hidden md:block w-64 bg-white p-6 border-r border-gray-200 sticky top-0 h-screen overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Categories</h2>
      
      {loading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {/* All Category */}
          <button
            onClick={() => setSelectedCategory("All")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${
              selectedCategory === "All"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center gap-2 font-medium">
              <span>📁</span>
              All
            </span>
            <span className={`text-sm font-semibold ${
              selectedCategory === "All" ? "text-white" : "text-gray-500"
            }`}>
              {getCategoryCount("All")}
            </span>
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${
                selectedCategory === cat.name
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-2 font-medium">
                <span>{cat.icon}</span>
                {cat.name}
              </span>
              <span className={`text-sm font-semibold ${
                selectedCategory === cat.name ? "text-white" : "text-gray-500"
              }`}>
                {getCategoryCount(cat.name)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}