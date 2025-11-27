// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { API } from "../api/api";
// import { useAuth } from "../context/AuthContext";
// import { toast } from 'sonner';
// import Comments from "../components/Comments";
// import ContactModal from "../components/ContactModal";

// export default function ProjectDetails() {
//   const { projectId } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [project, setProject] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isLiked, setIsLiked] = useState(false);
//   const [likes, setLikes] = useState(0);
//   const [showContactModal, setShowContactModal] = useState(false);

//   useEffect(() => {
//     fetchProject();
//     incrementView();
//     checkLikeStatus();
//   }, [projectId]);

//   const fetchProject = async () => {
//     try {
//       const res = await API.get(`/projects/${projectId}`);
//       setProject(res.data);
//       setLikes(res.data.likes || 0);
//     } catch (err) {
//       console.error("Fetch project error:", err);
//       toast.error("Failed to load project");
//     }
//   };

//   const incrementView = async () => {
//     try {
//       await API.post(`/projects/${projectId}/view`);
//     } catch (err) {
//       console.error("View increment error:", err);
//     }
//   };

//   const checkLikeStatus = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const headers = token ? { Authorization: `Bearer ${token}` } : {};
//       const res = await API.get(`/projects/${projectId}/like-status`, {
//         headers,
//       });
//       setIsLiked(res.data.isLiked);
//     } catch (err) {
//       console.error("Check like status error:", err);
//     }
//   };

//   const handleLike = async () => {
//     if (!user) {
//       toast.error("Please login to like projects");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const res = await API.post(
//         `/projects/${projectId}/like`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setIsLiked(res.data.isLiked);
//       setLikes(res.data.likes);
//       toast.success(res.data.message);
//     } catch (err) {
//       console.error("Like error:", err);
//       toast.error("Failed to like project");
//     }
//   };

//   const handleDelete = async () => {
//     if (!window.confirm("Are you sure you want to delete this project?"))
//       return;

//     try {
//       const token = localStorage.getItem("token");
//       await API.delete(`/projects/${projectId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Project deleted successfully");
//       navigate("/profile");
//     } catch (err) {
//       console.error("Delete error:", err);
//       toast.error("Failed to delete project");
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 0) return "Today";
//     if (diffDays === 1) return "Yesterday";
//     if (diffDays < 7) return `${diffDays} days ago`;
//     if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
//     if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
//     return date.toLocaleDateString();
//   };

//   if (!project) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-t-2 border-b-2 border-amber-400"></div>
//       </div>
//     );
//   }

//   const isOwner = user && project.userId._id === user._id;

//   return (
//     <div className="max-w-7xl mx-auto p-3 md:p-4 lg:p-6">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="mb-4 md:mb-6 flex items-center gap-2 text-stone-700 hover:text-blue-600 transition-colors text-sm md:text-base"
//       >
//         <svg
//           className="w-4 h-4 md:w-5 md:h-5"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M10 19l-7-7m0 0l7-7m-7 7h18"
//           />
//         </svg>
//         Back
//       </button>

//       <div>
//         {/* Main Content */}
//         <div className="lg:col-span-2">
//           {/* Image Gallery */}
//           <div className="rounded-sm overflow-hidden shadow-sm pt-4 md:pt-8 mb-4 md:mb-6 bg-stone-800">
//             <div className="relative flex justify-center items-center">
//               <img
//                 src={project.images[currentImageIndex]}
//                 alt={project.title}
//                 className="w-full h-60 sm:h-80 md:h-96 lg:h-120 object-contain bg-stone-800"
//               />

//               {/* Navigation Arrows */}
//               {project.images.length > 1 && (
//                 <>
//                   <button
//                     onClick={() =>
//                       setCurrentImageIndex((prev) =>
//                         prev === 0 ? project.images.length - 1 : prev - 1
//                       )
//                     }
//                     className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 px-2 md:px-3 py-1 rounded-sm shadow-sm hover:bg-stone-700/70 transition-colors"
//                   >
//                     <svg
//                       className="w-6 h-6 md:w-8 md:h-8 text-blue-600"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 19l-7-7 7-7"
//                       />
//                     </svg>
//                   </button>
//                   <button
//                     onClick={() =>
//                       setCurrentImageIndex((prev) =>
//                         prev === project.images.length - 1 ? 0 : prev + 1
//                       )
//                     }
//                     className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 px-2 md:px-3 py-1 rounded-sm shadow-sm hover:bg-stone-700/70 transition-colors"
//                   >
//                     <svg
//                       className="w-6 h-6 md:w-8 md:h-8 text-blue-600"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 5l7 7-7 7"
//                       />
//                     </svg>
//                   </button>
//                 </>
//               )}

//               {/* Image Counter */}
//               <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 bg-black/90 text-white px-2 md:px-3 py-1 rounded-sm text-xs md:text-sm">
//                 {currentImageIndex + 1} / {project.images.length}
//               </div>
//             </div>

//             {/* Thumbnail Strip */}
//             {project.images.length > 1 && (
//               <div className="p-3 md:p-4 flex gap-2 overflow-x-auto justify-center">
//                 {project.images.map((img, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setCurrentImageIndex(idx)}
//                     className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded overflow-hidden border-2 transition-all ${
//                       currentImageIndex === idx
//                         ? "border-amber-400 scale-105"
//                         : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
//                     }`}
//                   >
//                     <img
//                       src={img}
//                       alt={`${project.title} ${idx + 1}`}
//                       className="w-full h-full object-contain"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Project Info */}
//           <div>
//             <div className="flex items-start justify-between mb-3 md:mb-4 gap-2">
//               <div className="flex-1 min-w-0">
//                 <h1 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2 break-words">
//                   {project.title}
//                 </h1>
//                 <span className="inline-block text-blue-600/90 text-xs md:text-sm italic break-words">
//                   <span className="text-stone-600">Category: </span>
//                   {project.category}
//                 </span>
//               </div>

//               {/* Owner Actions */}
//               {isOwner && (
//                 <div className="flex gap-2 flex-shrink-0">
//                   <button
//                     onClick={() => navigate(`/edit-project/${projectId}`)}
//                     className="p-1.5 md:p-2 text-blue-600 hover:text-stone-50 hover:bg-blue-600 rounded-sm transition-colors"
//                     title="Edit"
//                   >
//                     <svg
//                       className="w-4 h-4 md:w-5 md:h-5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                       />
//                     </svg>
//                   </button>
//                   <button
//                     onClick={handleDelete}
//                     className="p-1.5 md:p-2 text-red-600 hover:text-stone-50 hover:bg-red-700 rounded-sm transition-colors"
//                     title="Delete"
//                   >
//                     <svg
//                       className="w-4 h-4 md:w-5 md:h-5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               )}
//             </div>

//             <Link
//               to={`/user/${project.userId._id}`}
//               className="flex items-center mb-4 md:mb-6 gap-3 md:gap-4"
//             >
//               {project.userId.avatar ? (
//                 <img
//                   src={project.userId.avatar}
//                   alt={project.userId.username}
//                   className="w-10 h-10 md:w-12 md:h-12 rounded-sm border-4 border-stone-800"
//                 />
//               ) : (
//                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-sm bg-stone-800 border-4 border-stone-800 text-white text-2xl md:text-3xl font-bold flex items-center justify-center">
//                   {project.userId.username?.charAt(0).toUpperCase()}
//                 </div>
//               )}

//               <p className="text-base md:text-lg font-bold text-stone-800 hover:text-stone-600 transition-colors">
//                 {project.userId.username}
//               </p>
//             </Link>

//             {/* Description */}
//             <p className="text-sm md:text-base text-stone-800 mb-4 md:mb-6 whitespace-pre-wrap leading-relaxed bg-stone-200 py-3 px-4 md:px-5 rounded-sm font-semibold break-words">
//               <span className="font-extrabold">Description:</span> <br />
//               {project.description}
//             </p>

//             {/* Stats */}
//             <div className="flex items-center gap-4 md:gap-6 text-xs md:text-base text-stone-600 border-t border-gray-200 dark:border-gray-700 pt-3 md:pt-4 flex-wrap">
//               <div className="flex items-center gap-1 md:gap-2">
//                 <span>👁️</span>
//                 <span>{project.views || 0} views</span>
//               </div>
//               <div className="flex items-center gap-1 md:gap-2">
//                 <span>❤️</span>
//                 <span>{likes} likes</span>
//               </div>
//               <div className="flex items-center gap-1 md:gap-2">
//                 <span>📅</span>
//                 <span>{formatDate(project.createdAt)}</span>
//               </div>
//             </div>

//             {/* Like Button */}
//             {!isOwner && (
//               <button
//                 onClick={handleLike}
//                 className={`mt-3 md:mt-4 w-full py-2 md:py-3 rounded-sm font-medium transition-all text-sm md:text-base ${
//                   isLiked
//                     ? "bg-red-700 hover:bg-stone-500 text-stone-50"
//                     : "dark:bg-stone-500 text-stone-50 hover:bg-red-700"
//                 }`}
//               >
//                 {isLiked ? "♥️ Liked" : "🤍 Like"}
//               </button>
//             )}
//           </div>

//           {/* Comments Section */}
//           <Comments projectId={projectId} />
//         </div>
//       </div>

//       {/* Contact Modal */}
//       {showContactModal && (
//         <ContactModal
//           targetUser={project.userId}
//           projectId={projectId}
//           onClose={() => setShowContactModal(false)}
//         />
//       )}
//     </div>
//   );
// }






















import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { toast } from 'sonner';
import Comments from "../components/Comments";
import ContactModal from "../components/ContactModal";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchProject();
    incrementView();
    checkLikeStatus();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const res = await API.get(`/projects/${projectId}`);
      setProject(res.data);
      setLikes(res.data.likes || 0);
    } catch (err) {
      console.error("Fetch project error:", err);
      toast.error("Failed to load project");
    }
  };

  const incrementView = async () => {
    try {
      await API.post(`/projects/${projectId}/view`);
    } catch (err) {
      console.error("View increment error:", err);
    }
  };

  const checkLikeStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await API.get(`/projects/${projectId}/like-status`, {
        headers,
      });
      setIsLiked(res.data.isLiked);
    } catch (err) {
      console.error("Check like status error:", err);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like projects");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        `/projects/${projectId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsLiked(res.data.isLiked);
      setLikes(res.data.likes);
      toast.success(res.data.message);
    } catch (err) {
      console.error("Like error:", err);
      toast.error("Failed to like project");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete this project? This action cannot be undone."))
      return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Project deleted successfully");
      navigate("/profile");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete project");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-1/2 -translate-x-1/2"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  const isOwner = user && project.userId._id === user._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 mb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all shadow-md hover:shadow-lg border border-gray-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-8">
                <img
                  src={project.images[currentImageIndex]}
                  alt={project.title}
                  className="w-full h-80 sm:h-96 md:h-[500px] object-contain rounded-2xl"
                />

                {/* Navigation Arrows */}
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? project.images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-xl shadow-xl transition-all hover:scale-110"
                    >
                      <svg
                        className="w-6 h-6 text-gray-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === project.images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-xl shadow-xl transition-all hover:scale-110"
                    >
                      <svg
                        className="w-6 h-6 text-gray-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                  {currentImageIndex + 1} / {project.images.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {project.images.length > 1 && (
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-t border-gray-200">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {project.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-4 transition-all ${
                          currentImageIndex === idx
                            ? "border-blue-600 scale-105 shadow-lg"
                            : "border-gray-200 hover:border-blue-400 hover:scale-105"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${project.title} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Project Description Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                    {project.title}
                  </h1>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-sm font-semibold text-blue-700">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Owner Actions */}
                {isOwner && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/edit-project/${projectId}`)}
                      className="p-3 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-110"
                      title="Edit Project"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-3 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-110"
                      title="Delete Project"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">👁️</div>
                  <div className="text-2xl font-black text-gray-900">{project.views || 0}</div>
                  <div className="text-xs text-gray-500 font-medium">Views</div>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">❤️</div>
                  <div className="text-2xl font-black text-gray-900">{likes}</div>
                  <div className="text-xs text-gray-500 font-medium">Likes</div>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">📅</div>
                  <div className="text-sm font-bold text-gray-900">{formatDate(project.createdAt)}</div>
                  <div className="text-xs text-gray-500 font-medium">Posted</div>
                </div>
              </div>

              {/* Like Button */}
              {!isOwner && (
                <button
                  onClick={handleLike}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                    isLiked
                      ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  }`}
                >
                  {isLiked ? (
                    <>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                      </svg>
                      Liked
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                      Like this Project
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Comments Section */}
            <Comments projectId={projectId} />
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Creator Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                  Created By
                </h3>
                <Link
                  to={`/user/${project.userId._id}`}
                  className="group block"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {project.userId.avatar ? (
                      <img
                        src={project.userId.avatar}
                        alt={project.userId.username}
                        className="w-16 h-16 rounded-2xl object-cover border-4 border-gray-200 group-hover:border-blue-500 transition-all"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 border-4 border-gray-200 group-hover:border-blue-500 text-white text-2xl font-bold flex items-center justify-center transition-all">
                        {project.userId.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                        {project.userId.username}
                      </h4>
                      {project.userId.designation && (
                        <p className="text-sm text-gray-600">
                          {project.userId.designation}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg">
                    <span>View Profile</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Link>
              </div>

              {/* Share Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                  Share Project
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!");
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </button>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact
                  </button>
                </div>
              </div>

              {/* Tags Card (if you have tags) */}
              {project.tags && project.tags.length > 0 && (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          targetUser={project.userId}
          projectId={projectId}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
}