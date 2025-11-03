import { useState } from "react";
import { API } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import TagsInput from "../components/TagsInput";

export default function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    thumbnail: null,
    files: [],
  });
  
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]); // 🔥 Tags state

  const categories = {
    "3d": ["Character Modeling", "Environment Modeling", "Product Visualization", "Architectural Visualization", "3D Animation"],
    "Art": ["Digital Art", "Traditional Art", "3D Modeling", "Character Design", "Concept Art"],
    "Branding": ["Brand Strategy", "Visual Identity", "Brand Guidelines", "Rebranding", "Brand Messaging"],
    "Web Development": ["Frontend", "Backend", "Full Stack", "UI/UX Design", "E-commerce"],
    "Game Development": ["2D Games", "3D Games", "Unity", "Unreal Engine", "Mobile Games"],
    "Graphics Design": ["Logo Design", "Branding", "Illustration", "Print Design", "Social Media"],
    "Mobile Apps": ["Android", "iOS", "React Native", "Flutter", "Cross-platform"],
    "Music": ["Production", "Composition", "Sound Design", "Mixing", "Cover Songs"],
    "Photography": ["Portrait", "Landscape", "Product", "Wildlife", "Fashion"],
    "Video Production": ["Animation", "Video Editing", "Motion Graphics", "Documentary", "Commercial"],
    "Writing": ["Blog Posts", "Copywriting", "Technical Writing", "Creative Writing", "Content Strategy"],
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setData({ ...data, thumbnail: file });
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    toast.success("Thumbnail selected!");
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    if (data.files.length + files.length > 4) {
      toast.error("You can upload maximum 4 additional images");
      return;
    }

    const validFiles = [];
    const newPreviews = [];
    let hasError = false;

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        hasError = true;
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        hasError = true;
        return;
      }

      validFiles.push(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === validFiles.length) {
          setPreviews([...previews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (validFiles.length > 0) {
      setData({ ...data, files: [...data.files, ...validFiles] });
      if (!hasError) {
        toast.success(`${validFiles.length} image${validFiles.length > 1 ? 's' : ''} selected!`);
      }
    }
  };

  const removeThumbnail = () => {
    setData({ ...data, thumbnail: null });
    setThumbnailPreview(null);
    toast.success("Thumbnail removed");
  };

  const removeImage = (index) => {
    const newFiles = data.files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setData({ ...data, files: newFiles });
    setPreviews(newPreviews);
    toast.success("Image removed");
  };

  const handleCategoryChange = (e) => {
    setData({ ...data, category: e.target.value, subcategory: "" });
  };

  const resetForm = () => {
    setData({
      title: "",
      description: "",
      category: "",
      subcategory: "",
      thumbnail: null,
      files: [],
    });
    setThumbnailPreview(null);
    setPreviews([]);
    setTags([]); // 🔥 Reset tags
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user exists
    if (!user || !user._id) {
      toast.error("Please login to upload projects");
      navigate("/login");
      return;
    }
    
    if (!data.title || !data.description || !data.category || !data.subcategory || !data.thumbnail) {
      toast.error("Please fill all required fields and select a thumbnail");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Uploading your project...");

    try {
      const form = new FormData();
      form.append("title", data.title);
      form.append("description", data.description);
      form.append("category", `${data.category} - ${data.subcategory}`);
      form.append("userId", user._id.toString());
      form.append("thumbnail", data.thumbnail);
      
      // 🔥 Add tags as JSON string
      if (tags.length > 0) {
        form.append("tags", JSON.stringify(tags));
      }
      
      // Additional files
      data.files.forEach((file) => {
        form.append("files", file);
      });

      console.log("📤 Uploading project:", {
        title: data.title,
        category: `${data.category} - ${data.subcategory}`,
        userId: user._id,
        thumbnail: data.thumbnail?.name,
        additionalFiles: data.files.length,
        tags: tags // 🔥 Log tags
      });

      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Session expired. Please login again.", { id: loadingToast });
        navigate("/login");
        return;
      }

      const response = await API.post("/projects/upload", form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        }
      });

      console.log("✅ Upload success:", response.data);

      toast.success("Project uploaded successfully! 🎉", {
        id: loadingToast,
      });

      resetForm();
      
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
      
    } catch (err) {
      console.error("❌ Upload error:", err);
      console.error("Error response:", err.response?.data);
      
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.", { id: loadingToast });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        toast.error(
          err.response?.data?.message || "Upload failed. Please try again.",
          { id: loadingToast }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
            Upload New Project
          </h2>

          {/* Thumbnail Upload */}
          {thumbnailPreview ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thumbnail Image <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                  Thumbnail
                </span>
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  disabled={loading}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thumbnail Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="thumbnail-upload"
                onChange={handleThumbnailChange}
                disabled={loading}
              />
              <label
                htmlFor="thumbnail-upload"
                className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all bg-gray-50 dark:bg-gray-700"
              >
                <div className="text-center">
                  <p className="text-4xl mb-2">🖼️</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Click to upload thumbnail
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Additional Images */}
          {previews.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Images ({previews.length}/4)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add More Images Button */}
          {data.files.length < 4 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add More Images (Optional, max 4 total)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="files-upload"
                onChange={handleFileChange}
                disabled={loading}
              />
              <label
                htmlFor="files-upload"
                className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all bg-gray-50 dark:bg-gray-700"
              >
                <div className="text-center">
                  <p className="text-2xl mb-1">📁</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to add more images ({4 - data.files.length} remaining)
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project title"
              disabled={loading}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={data.description}
              rows="4"
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe your project..."
              disabled={loading}
              required
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={data.category}
              onChange={handleCategoryChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
              disabled={loading}
              required
            >
              <option value="">Select a category</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          {data.category && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subcategory <span className="text-red-500">*</span>
              </label>
              <select
                value={data.subcategory}
                onChange={(e) => setData({ ...data, subcategory: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                disabled={loading}
                required
              >
                <option value="">Select a subcategory</option>
                {categories[data.category].map((subcat) => (
                  <option key={subcat} value={subcat}>{subcat}</option>
                ))}
              </select>
            </div>
          )}

          {/* 🔥 Tags Input Component */}
          <div className="mb-6">
            <TagsInput tags={tags} setTags={setTags} />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !data.thumbnail}
            className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : !data.thumbnail ? "Select Thumbnail to Upload" : "Upload Project"}
          </button>

          {!data.thumbnail && (
            <p className="mt-2 text-sm text-center text-red-500 dark:text-red-400">
              * Thumbnail is required
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
















// import { useState } from "react";
// import { API } from "../api/api";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import TagsInput from "../components/TagsInput";




// export default function Upload() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
  
//   const [data, setData] = useState({
//     title: "",
//     description: "",
//     category: "",
//     subcategory: "",
//     thumbnail: null,
//     files: [],
//   });
  
//   const [thumbnailPreview, setThumbnailPreview] = useState(null);
//   const [previews, setPreviews] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const categories = {
//     "3d": ["Character Modeling", "Environment Modeling", "Product Visualization", "Architectural Visualization", "3D Animation"],
//     "Art": ["Digital Art", "Traditional Art", "3D Modeling", "Character Design", "Concept Art"],
//     "Branding": ["Brand Strategy", "Visual Identity", "Brand Guidelines", "Rebranding", "Brand Messaging"],
//     "Web Development": ["Frontend", "Backend", "Full Stack", "UI/UX Design", "E-commerce"],
//     "Game Development": ["2D Games", "3D Games", "Unity", "Unreal Engine", "Mobile Games"],
//     "Graphics Design": ["Logo Design", "Branding", "Illustration", "Print Design", "Social Media"],
//     "Mobile Apps": ["Android", "iOS", "React Native", "Flutter", "Cross-platform"],
//     "Music": ["Production", "Composition", "Sound Design", "Mixing", "Cover Songs"],
//     "Photography": ["Portrait", "Landscape", "Product", "Wildlife", "Fashion"],
//     "Video Production": ["Animation", "Video Editing", "Motion Graphics", "Documentary", "Commercial"],
//     "Writing": ["Blog Posts", "Copywriting", "Technical Writing", "Creative Writing", "Content Strategy"],
//   };

//   const handleThumbnailChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       toast.error("Please select an image file");
//       return;
//     }
    
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("Image size should be less than 5MB");
//       return;
//     }

//     setData({ ...data, thumbnail: file });
    
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setThumbnailPreview(reader.result);
//     };
//     reader.readAsDataURL(file);
    
//     toast.success("Thumbnail selected!");
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
    
//     if (files.length === 0) return;
    
//     if (data.files.length + files.length > 4) {
//       toast.error("You can upload maximum 4 additional images");
//       return;
//     }

//     const validFiles = [];
//     const newPreviews = [];
//     let hasError = false;

//     files.forEach((file) => {
//       if (!file.type.startsWith('image/')) {
//         toast.error(`${file.name} is not an image file`);
//         hasError = true;
//         return;
//       }
      
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error(`${file.name} is too large (max 5MB)`);
//         hasError = true;
//         return;
//       }

//       validFiles.push(file);
      
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         newPreviews.push(reader.result);
//         if (newPreviews.length === validFiles.length) {
//           setPreviews([...previews, ...newPreviews]);
//         }
//       };
//       reader.readAsDataURL(file);
//     });

//     if (validFiles.length > 0) {
//       setData({ ...data, files: [...data.files, ...validFiles] });
//       if (!hasError) {
//         toast.success(`${validFiles.length} image${validFiles.length > 1 ? 's' : ''} selected!`);
//       }
//     }
//   };

//   const removeThumbnail = () => {
//     setData({ ...data, thumbnail: null });
//     setThumbnailPreview(null);
//     toast.success("Thumbnail removed");
//   };

//   const removeImage = (index) => {
//     const newFiles = data.files.filter((_, i) => i !== index);
//     const newPreviews = previews.filter((_, i) => i !== index);
    
//     setData({ ...data, files: newFiles });
//     setPreviews(newPreviews);
//     toast.success("Image removed");
//   };

//   const handleCategoryChange = (e) => {
//     setData({ ...data, category: e.target.value, subcategory: "" });
//   };

//   const resetForm = () => {
//     setData({
//       title: "",
//       description: "",
//       category: "",
//       subcategory: "",
//       thumbnail: null,
//       files: [],
//     });
//     setThumbnailPreview(null);
//     setPreviews([]);
//   };


//   const [tags, setTags] = useState([]);




//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // 🔥 CRITICAL: Check if user exists
//     if (!user || !user._id) {
//       toast.error("Please login to upload projects");
//       navigate("/login");
//       return;
//     }
    
//     if (!data.title || !data.description || !data.category || !data.subcategory || !data.thumbnail) {
//       toast.error("Please fill all required fields and select a thumbnail");
//       return;
//     }

//     setLoading(true);

//     const loadingToast = toast.loading("Uploading your project...");

//     try {
//       const form = new FormData();
//       form.append("title", data.title);
//       form.append("description", data.description);
//       form.append("category", `${data.category} - ${data.subcategory}`);
      
//       // 🔥 IMPORTANT: Ensure userId is string
//       form.append("userId", user._id.toString());
      
//       // 🔥 Thumbnail (required)
//       form.append("thumbnail", data.thumbnail);
      
//       // 🔥 Additional files (optional)
//       data.files.forEach((file) => {
//         form.append("files", file);
//       });

//       // 🔥 Debug log
//       console.log("📤 Uploading project:", {
//         title: data.title,
//         category: `${data.category} - ${data.subcategory}`,
//         userId: user._id,
//         thumbnail: data.thumbnail?.name,
//         additionalFiles: data.files.length
//       });

//       const response = await API.post("/projects/upload", form, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       console.log("✅ Upload success:", response.data);

//       toast.success("Project uploaded successfully! 🎉", {
//         id: loadingToast,
//       });

//       resetForm();
      
//       setTimeout(() => {
//         navigate("/profile");
//       }, 1000);
      
//     } catch (err) {
//       console.error("❌ Upload error:", err);
//       console.error("Error response:", err.response?.data);
      
//       toast.error(
//         err.response?.data?.message || "Upload failed. Please try again.",
//         { id: loadingToast }
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 flex items-center justify-center">
//       <div className="w-full max-w-3xl">
//         <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
//           <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
//             Upload New Project
//           </h2>

//           {/* Thumbnail Upload */}
//           {thumbnailPreview ? (
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Thumbnail Image <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <img 
//                   src={thumbnailPreview} 
//                   alt="Thumbnail" 
//                   className="w-full h-64 object-cover rounded-lg"
//                 />
//                 <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
//                   Thumbnail
//                 </span>
//                 <button
//                   type="button"
//                   onClick={removeThumbnail}
//                   className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
//                   disabled={loading}
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Thumbnail Image <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 id="thumbnail-upload"
//                 onChange={handleThumbnailChange}
//                 disabled={loading}
//               />
//               <label
//                 htmlFor="thumbnail-upload"
//                 className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all bg-gray-50 dark:bg-gray-700"
//               >
//                 <div className="text-center">
//                   <p className="text-4xl mb-2">🖼️</p>
//                   <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
//                     Click to upload thumbnail
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
//                     PNG, JPG, GIF up to 5MB
//                   </p>
//                 </div>
//               </label>
//             </div>
//           )}

//           {/* Additional Images */}
//           {previews.length > 0 && (
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Additional Images ({previews.length}/4)
//               </label>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                 {previews.map((preview, index) => (
//                   <div key={index} className="relative group">
//                     <img
//                       src={preview}
//                       alt={`Preview ${index + 1}`}
//                       className="w-full h-32 object-cover rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeImage(index)}
//                       className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
//                       disabled={loading}
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Add More Images Button */}
//           {data.files.length < 4 && (
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Add More Images (Optional, max 4 total)
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 className="hidden"
//                 id="files-upload"
//                 onChange={handleFileChange}
//                 disabled={loading}
//               />
//               <label
//                 htmlFor="files-upload"
//                 className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all bg-gray-50 dark:bg-gray-700"
//               >
//                 <div className="text-center">
//                   <p className="text-2xl mb-1">📁</p>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Click to add more images ({4 - data.files.length} remaining)
//                   </p>
//                 </div>
//               </label>
//             </div>
//           )}

//           {/* Title */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Project Title <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={data.title}
//               onChange={(e) => setData({ ...data, title: e.target.value })}
//               className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter project title"
//               disabled={loading}
//               required
//             />
//           </div>

//           {/* Description */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Description <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               value={data.description}
//               rows="4"
//               onChange={(e) => setData({ ...data, description: e.target.value })}
//               className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
//               placeholder="Describe your project..."
//               disabled={loading}
//               required
//             />
//           </div>

//           {/* Category */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Category <span className="text-red-500">*</span>
//             </label>
//             <select
//               value={data.category}
//               onChange={handleCategoryChange}
//               className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
//               disabled={loading}
//               required
//             >
//               <option value="">Select a category</option>
//               {Object.keys(categories).map((cat) => (
//                 <option key={cat} value={cat}>{cat}</option>
//               ))}
//             </select>
//           </div>

//           {/* Subcategory */}
//           {data.category && (
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Subcategory <span className="text-red-500">*</span>
//               </label>
//               <select
//                 value={data.subcategory}
//                 onChange={(e) => setData({ ...data, subcategory: e.target.value })}
//                 className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
//                 disabled={loading}
//                 required
//               >
//                 <option value="">Select a subcategory</option>
//                 {categories[data.category].map((subcat) => (
//                   <option key={subcat} value={subcat}>{subcat}</option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading || !data.thumbnail}
//             className="w-full bg-amber-400 hover:bg-amber-400 dark:bg-amber-400 dark:hover:bg-amber-400 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
//           >
//             {loading ? "Uploading..." : !data.thumbnail ? "Select Thumbnail to Upload" : "Upload Project"}
//           </button>

//           {!data.thumbnail && (
//             <p className="mt-2 text-sm text-center text-red-500 dark:text-red-400">
//               * Thumbnail is required
//             </p>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }














// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { API } from "../api/api";
// import { useAuth } from "../context/AuthContext";
// import toast from "react-hot-toast";
// import TagsInput from "../components/TagsInput";

// export default function Upload() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [thumbnail, setThumbnail] = useState(null);
//   const [additionalImages, setAdditionalImages] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [thumbnailPreview, setThumbnailPreview] = useState(null);
//   const [imagePreviews, setImagePreviews] = useState([]);

//   const categories = [
//     "3d",
//     "Art",
//     "Branding",
//     "Web Development",
//     "Game Development",
//     "Graphics Design",
//     "Mobile Apps",
//     "Music",
//     "Photography",
//     "Video Production",
//     "Writing",
//   ];

//   const handleThumbnailChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setThumbnail(file);
//       setThumbnailPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleAdditionalImagesChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (additionalImages.length + files.length > 4) {
//       toast.error("Maximum 4 additional images allowed");
//       return;
//     }
//     setAdditionalImages([...additionalImages, ...files]);
//     const newPreviews = files.map((file) => URL.createObjectURL(file));
//     setImagePreviews([...imagePreviews, ...newPreviews]);
//   };

//   const removeAdditionalImage = (index) => {
//     const newImages = additionalImages.filter((_, i) => i !== index);
//     const newPreviews = imagePreviews.filter((_, i) => i !== index);
//     setAdditionalImages(newImages);
//     setImagePreviews(newPreviews);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // 🔥 Check if user is logged in
//     if (!user) {
//       toast.error("Please login to upload projects");
//       navigate("/login");
//       return;
//     }

//     if (!thumbnail) {
//       toast.error("Please select a thumbnail image");
//       return;
//     }

//     if (!category) {
//       toast.error("Please select a category");
//       return;
//     }

//     setLoading(true);
//     const loadingToast = toast.loading("Uploading project...");

//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("description", description);
//       formData.append("category", category);
//       formData.append("userId", user._id);
//       formData.append("thumbnail", thumbnail);

//       // Add tags
//       if (tags.length > 0) {
//         formData.append("tags", JSON.stringify(tags));
//       }

//       // Add additional images
//       additionalImages.forEach((file) => {
//         formData.append("files", file);
//       });

//       // 🔥 Get token from localStorage
//       const token = localStorage.getItem("token");
      
//       console.log("📤 Uploading with token:", token ? "✅ Token exists" : "❌ No token");
//       console.log("📤 User ID:", user._id);

//       if (!token) {
//         toast.error("Session expired. Please login again.", { id: loadingToast });
//         navigate("/login");
//         return;
//       }

//       const res = await API.post("/projects/upload", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("✅ Upload success:", res.data);

//       toast.success("Project uploaded successfully! 🎉", {
//         id: loadingToast,
//       });

//       // Reset form
//       setTitle("");
//       setDescription("");
//       setCategory("");
//       setThumbnail(null);
//       setAdditionalImages([]);
//       setTags([]);
//       setThumbnailPreview(null);
//       setImagePreviews([]);

//       navigate("/profile");
//     } catch (err) {
//       console.error("❌ Upload error:", err);
//       console.error("Error response:", err.response?.data);
      
//       if (err.response?.status === 401) {
//         toast.error("Session expired. Please login again.", { id: loadingToast });
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         navigate("/login");
//       } else {
//         toast.error(err.response?.data?.message || "Upload failed", {
//           id: loadingToast,
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔥 Redirect if not logged in
//   if (!user) {
//     navigate("/login");
//     return null;
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
//         Upload New Project
//       </h1>

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6"
//       >
//         {/* Title */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Project Title *
//           </label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter project title"
//             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
//             required
//             disabled={loading}
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Description *
//           </label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Describe your project..."
//             rows="5"
//             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400 resize-none"
//             required
//             disabled={loading}
//           />
//         </div>

//         {/* Category */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Category *
//           </label>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400 cursor-pointer"
//             required
//             disabled={loading}
//           >
//             <option value="">Select a category</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Tags */}
//         <TagsInput tags={tags} setTags={setTags} />

//         {/* Thumbnail */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Thumbnail Image *
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleThumbnailChange}
//             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
//             required
//             disabled={loading}
//           />
//           {thumbnailPreview && (
//             <div className="mt-3">
//               <img
//                 src={thumbnailPreview}
//                 alt="Thumbnail preview"
//                 className="w-full max-h-64 object-cover rounded-lg"
//               />
//             </div>
//           )}
//         </div>

//         {/* Additional Images */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Additional Images (Max 4)
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleAdditionalImagesChange}
//             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
//             disabled={loading || additionalImages.length >= 4}
//           />
//           {imagePreviews.length > 0 && (
//             <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
//               {imagePreviews.map((preview, idx) => (
//                 <div key={idx} className="relative group">
//                   <img
//                     src={preview}
//                     alt={`Preview ${idx + 1}`}
//                     className="w-full h-32 object-cover rounded-lg"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeAdditionalImage(idx)}
//                     className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={loading || !thumbnail || !category}
//           className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {loading ? "Uploading..." : "Upload Project"}
//         </button>
//       </form>
//     </div>
//   );
// }