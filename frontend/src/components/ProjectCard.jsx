import { useState } from "react";

export default function ProjectCard({ project }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // 🔥 Image URL check এবং fix করা
  const getImageUrl = () => {
    if (!project.imageUrl) return null;
    
    // যদি relative path হয়, তাহলে base URL যোগ করা
    if (project.imageUrl.startsWith('/uploads/')) {
      return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${project.imageUrl}`;
    }
    
    return project.imageUrl;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="break-inside-avoid mb-4 group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        {/* 🔥 Image container with error handling */}
        <div className="relative overflow-hidden bg-gray-200 dark:bg-gray-700">
          {imageUrl && !imageError ? (
            <>
              {/* Loading skeleton */}
              {imageLoading && (
                <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-600"></div>
              )}
              
              <img
                src={imageUrl}
                alt={project.title}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  console.error("Image failed to load:", imageUrl);
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            </>
          ) : (
            // 🔥 Placeholder যদি image না থাকে বা error হয়
            <div className="w-full h-64 flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
              <svg 
                className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 14 14"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <p className="text-sm text-gray-500 dark:text-gray-400">No Image</p>
            </div>
          )}
          
          {/* 🔥 Overlay effect on hover */}
          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
        </div>

        {/* 🔥 Content section */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {project.title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
            {project.description}
          </p>
          
          {/* 🔥 Footer section */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              {project.category}
            </span>
            
            <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-red-500 text-base">❤️</span>
              <span className="font-medium">{project.likes || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}