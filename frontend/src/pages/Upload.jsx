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
    thumbnail: null, // 🔥 Separate thumbnail
    files: [], // 🔥 Additional images
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null); // 🔥 Thumbnail preview
  const [previews, setPreviews] = useState([]); // 🔥 Additional images previews
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

  // 🔥 Thumbnail select করা
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      alert("Please select an image file");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setData({ ...data, thumbnail: file });
    
    // Preview তৈরি করা
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 🔥 Additional images select করা
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Maximum 4 additional images (total 5 with thumbnail)
    if (data.files.length + files.length > 4) {
      alert("You can upload maximum 4 additional images");
      return;
    }

    // Validate files
    const validFiles = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large (max 5MB)`);
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

    setData({ ...data, files: [...data.files, ...validFiles] });
  };

  // 🔥 Remove thumbnail
  const removeThumbnail = () => {
    setData({ ...data, thumbnail: null });
    setThumbnailPreview(null);
  };

  // 🔥 Remove additional image
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
      thumbnail: null,
      files: [],
    });
    setThumbnailPreview(null);
    setPreviews([]);
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!data.title || !data.description || !data.category || !data.subcategory || !data.thumbnail) {
      alert("Please fill all fields and select a thumbnail");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("title", data.title);
      form.append("description", data.description);
      form.append("category", `${data.category} - ${data.subcategory}`);
      form.append("userId", user._id);
      
      // 🔥 Thumbnail আলাদা করে পাঠানো
      form.append("thumbnail", data.thumbnail);
      
      // 🔥 Additional files পাঠানো
      data.files.forEach((file) => {
        form.append("files", file);
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

          {/* 🔥 Thumbnail Upload - First Priority */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thumbnail Image <span className="text-red-500">*</span>
            </label>
            
            {thumbnailPreview ? (
              // 🔥 Thumbnail preview
              <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                  Thumbnail
                </div>
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  title="Remove thumbnail"
                >
                  ✕
                </button>
              </div>
            ) : (
              // 🔥 Thumbnail upload button
              <div className="relative">
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
                  className="flex items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all bg-gray-50 dark:bg-gray-700"
                >
                  <div className="text-center">
                    <p className="text-4xl mb-2">🖼️</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Click to upload thumbnail
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      This will be the main image for your project
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* 🔥 Additional Images Preview */}
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
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🔥 Additional Images Upload - Optional */}
          {data.files.length < 4 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Images (Optional - Max 4)
              </label>
              <div className="relative">
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
                      Click to add more images
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {4 - data.files.length} more image{4 - data.files.length !== 1 ? 's' : ''} can be added
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Title <span className="text-red-500">*</span>
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
              Description <span className="text-red-500">*</span>
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
              Category <span className="text-red-500">*</span>
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
                Subcategory <span className="text-red-500">*</span>
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