

import { useState } from "react";
import { API } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    files: [], // 🔥 Multiple files
  });
  const [previews, setPreviews] = useState([]); // 🔥 Multiple previews
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Category data
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

  // 🔥 Multiple images select করা
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Maximum 5 images allowed
    if (files.length > 5) {
      alert("You can upload maximum 5 images");
      return;
    }

    // Validate each file
    const validFiles = [];
    const newPreviews = [];

    files.forEach((file) => {
      // File type validation
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return;
      }
      
      // File size validation (5MB max per file)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large (max 5MB)`);
        return;
      }

      validFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === validFiles.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });

    setData({ ...data, files: validFiles });
  };

  // 🔥 Single image remove করা
  const removeImage = (index) => {
    const newFiles = data.files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setData({ ...data, files: newFiles });
    setPreviews(newPreviews);
  };

  // Category change
  const handleCategoryChange = (e) => {
    setData({ ...data, category: e.target.value, subcategory: "" });
  };

  // Form reset
  const resetForm = () => {
    setData({
      title: "",
      description: "",
      category: "",
      subcategory: "",
      files: [],
    });
    setPreviews([]);
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!data.title || !data.description || !data.category || !data.subcategory || data.files.length === 0) {
      alert("Please fill all fields and select at least one image");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("title", data.title);
      form.append("description", data.description);
      form.append("category", `${data.category} - ${data.subcategory}`);
      form.append("userId", user._id);
      
      // 🔥 Multiple files append করা
      data.files.forEach((file) => {
        form.append("files", file); // Note: "files" plural
      });

      await API.post("/projects/upload", form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert("Project uploaded successfully! 🎉");
      resetForm();
      
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
      
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
            Upload New Project
          </h2>

          {/* 🔥 Multiple Images Preview */}
          {previews.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Images Preview ({previews.length}/5)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    {/* 🔥 Thumbnail badge - প্রথম image */}
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Thumbnail
                      </span>
                    )}
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                First image will be used as thumbnail
              </p>
            </div>
          )}

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Title
            </label>
            <input
              type="text"
              placeholder="Enter project title"
              value={data.title}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              onChange={(e) => setData({ ...data, title: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe your project"
              value={data.description}
              rows="4"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              onChange={(e) => setData({ ...data, description: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={data.category}
              onChange={handleCategoryChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
              disabled={loading}
              required
            >
              <option value="">Select a category</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          {data.category && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subcategory
              </label>
              <select
                value={data.subcategory}
                onChange={(e) => setData({ ...data, subcategory: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                disabled={loading}
                required
              >
                <option value="">Select a subcategory</option>
                {categories[data.category].map((subcat) => (
                  <option key={subcat} value={subcat}>
                    {subcat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 🔥 Multiple File Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Images (Max 5)
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple // 🔥 Multiple files allow করা
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
                disabled={loading}
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all bg-gray-50 dark:bg-gray-700"
              >
                <div className="text-center">
                  <p className="text-4xl mb-2">📁</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {data.files.length > 0 
                      ? `${data.files.length} image(s) selected` 
                      : "Click to upload images"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB each (Max 5 images)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Upload Project"}
          </button>
        </form>
      </div>
    </div>
  );
}