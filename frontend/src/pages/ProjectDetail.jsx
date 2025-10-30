// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { API } from "../api/api";

// export default function ProjectDetail() {
//   const { projectId } = useParams(); // 🔥 URL থেকে project ID নেওয়া
//   const navigate = useNavigate();
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0); // 🔥 Current image track করা

//   // 🔥 Project data fetch করা
//   useEffect(() => {
//     API.get(`/projects/${projectId}`)
//       .then((res) => {
//         console.log("📦 Project details:", res.data);
//         setProject(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("❌ Error fetching project:", err);
//         setLoading(false);
//       });
//   }, [projectId]);

//   // 🔥 Next image
//   const nextImage = () => {
//     if (project.images && currentImageIndex < project.images.length - 1) {
//       setCurrentImageIndex(currentImageIndex + 1);
//     }
//   };

//   // 🔥 Previous image
//   const prevImage = () => {
//     if (currentImageIndex > 0) {
//       setCurrentImageIndex(currentImageIndex - 1);
//     }
//   };

//   // 🔥 Keyboard navigation
//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (e.key === "ArrowLeft") prevImage();
//       if (e.key === "ArrowRight") nextImage();
//       if (e.key === "Escape") navigate(-1);
//     };
    
//     window.addEventListener("keydown", handleKeyPress);
//     return () => window.removeEventListener("keydown", handleKeyPress);
//   }, [currentImageIndex, project]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (!project) {
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen">
//         <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Project not found</p>
//         <button 
//           onClick={() => navigate(-1)}
//           className="text-blue-500 hover:text-blue-600"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* 🔥 Back button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
//         >
//           <span>←</span>
//           <span>Back</span>
//         </button>

//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
//           {/* 🔥 Image Carousel Section */}
//           {project.images && project.images.length > 0 && (
//             <div className="relative bg-black">
//               {/* 🔥 Main Image Display */}
//               <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio */}
//                 <img
//                   src={project.images[currentImageIndex]}
//                   alt={`${project.title} - Image ${currentImageIndex + 1}`}
//                   className="absolute inset-0 w-full h-full object-contain"
//                 />
//               </div>

//               {/* 🔥 Previous Button - শুধু প্রথম image না হলে দেখাবে */}
//               {currentImageIndex > 0 && (
//                 <button
//                   onClick={prevImage}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                   </svg>
//                 </button>
//               )}

//               {/* 🔥 Next Button - শুধু শেষ image না হলে দেখাবে */}
//               {currentImageIndex < project.images.length - 1 && (
//                 <button
//                   onClick={nextImage}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               )}

//               {/* 🔥 Image Counter */}
//               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm">
//                 {currentImageIndex + 1} / {project.images.length}
//               </div>

//               {/* 🔥 Thumbnail Navigation - সব images এর small preview */}
//               {project.images.length > 1 && (
//                 <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 p-2 rounded-lg">
//                   {project.images.map((img, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setCurrentImageIndex(index)}
//                       className={`w-16 h-16 rounded overflow-hidden border-2 transition-all ${
//                         index === currentImageIndex
//                           ? "border-blue-500 scale-110"
//                           : "border-transparent opacity-60 hover:opacity-100"
//                       }`}
//                     >
//                       <img
//                         src={img}
//                         alt={`Thumbnail ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* 🔥 Project Details Section */}
//           <div className="p-8">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
//               {project.title}
//             </h1>

//             <div className="flex items-center gap-4 mb-6">
//               <span className="text-sm font-medium text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
//                 {project.category}
//               </span>
              
//               <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
//                 <span className="text-red-500 text-xl">❤️</span>
//                 <span className="font-medium">{project.likes || 0} likes</span>
//               </div>
//             </div>

//             <div className="prose dark:prose-invert max-w-none">
//               <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
//                 Description
//               </h2>
//               <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
//                 {project.description}
//               </p>
//             </div>

//             {/* 🔥 Author Info - যদি populate করা থাকে */}
//             {project.userId && (
//               <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
//                   Created by
//                 </h3>
//                 <div className="flex items-center gap-3">
//                   {project.userId.avatar ? (
//                     <img
//                       src={project.userId.avatar}
//                       alt={project.userId.username}
//                       className="w-12 h-12 rounded-full"
//                     />
//                   ) : (
//                     <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
//                       {project.userId.username?.charAt(0).toUpperCase()}
//                     </div>
//                   )}
//                   <div>
//                     <p className="font-semibold text-gray-900 dark:text-white">
//                       {project.userId.username}
//                     </p>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       {project.userId.email}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/api";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 🔥 Project data fetch এবং view count increment
  useEffect(() => {
    // Fetch project data
    API.get(`/projects/${projectId}`)
      .then((res) => {
        console.log("📦 Project details:", res.data);
        setProject(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching project:", err);
        setLoading(false);
      });

    // 🔥 Increment view count
    API.post(`/projects/${projectId}/view`)
      .then((res) => {
        console.log("👁️ View counted:", res.data.views);
      })
      .catch((err) => {
        console.error("Error incrementing view:", err);
      });
  }, [projectId]);

  // Next image
  const nextImage = () => {
    if (project.images && currentImageIndex < project.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // Previous image
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") navigate(-1);
    };
    
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentImageIndex, project]);

  // 🔥 Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Project not found</p>
        <button 
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:text-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Image Carousel Section */}
          {project.images && project.images.length > 0 && (
            <div className="relative bg-black">
              {/* Main Image Display */}
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <img
                  src={project.images[currentImageIndex]}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>

              {/* Previous Button */}
              {currentImageIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Next Button */}
              {currentImageIndex < project.images.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm">
                {currentImageIndex + 1} / {project.images.length}
              </div>

              {/* Thumbnail Navigation */}
              {project.images.length > 1 && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 p-2 rounded-lg">
                  {project.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-blue-500 scale-110"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Project Details Section */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {project.title}
            </h1>

            {/* 🔥 Stats Row - Views, Likes, Date */}
            <div className="flex items-center gap-6 mb-6 text-sm text-gray-600 dark:text-gray-200">
              {/* Views */}
              <div className="flex items-center gap-2">
                <span className="text-xl">👁️</span>
                <span className="font-medium">{project.views || 0} views</span>
              </div>

              {/* Likes */}
              <div className="flex items-center gap-2">
                <span className="text-xl text-red-500">❤️</span>
                <span className="font-medium">{project.likes || 0} likes</span>
              </div>

              {/* Upload Date */}
              <div className="flex items-center gap-2">
                <span className="text-xl">📅</span>
                <span className="font-medium">
                  {formatDate(project.createdAt)}
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="mb-6">
              <span className="text-sm font-medium text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                {project.category}
              </span>
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {/* Author Info */}
            {project.userId && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Created by
                </h3>
                <div className="flex items-center gap-3">
                  {project.userId.avatar ? (
                    <img
                      src={project.userId.avatar}
                      alt={project.userId.username}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {project.userId.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {project.userId.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {project.userId.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}