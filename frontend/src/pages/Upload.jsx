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
    file: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔥 Category এবং Subcategory data
  const categories = {
    "Web Development": ["Frontend", "Backend", "Full Stack", "UI/UX Design", "E-commerce"],
    "Mobile Apps": ["Android", "iOS", "React Native", "Flutter", "Cross-platform"],
    "Graphics Design": ["Logo Design", "Branding", "Illustration", "Print Design", "Social Media"],
    "Photography": ["Portrait", "Landscape", "Product", "Wildlife", "Fashion"],
    "Video Production": ["Animation", "Video Editing", "Motion Graphics", "Documentary", "Commercial"],
    "Writing": ["Blog Posts", "Copywriting", "Technical Writing", "Creative Writing", "Content Strategy"],
    "Art": ["Digital Art", "Traditional Art", "3D Modeling", "Character Design", "Concept Art"],
    "Music": ["Production", "Composition", "Sound Design", "Mixing", "Cover Songs"],
  };

  // Image select করার সময় preview দেখানো
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // File type validation
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file");
        return;
      }
      
      // File size validation (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setData({ ...data, file });
      
      // Preview তৈরি করা
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔥 Category change করার সময় subcategory reset করা
  const handleCategoryChange = (e) => {
    setData({ ...data, category: e.target.value, subcategory: "" });
  };

  // Form reset করার function
  const resetForm = () => {
    setData({
      title: "",
      description: "",
      category: "",
      subcategory: "",
      file: null,
    });
    setPreview(null);
  };

  // Form submit with loading and redirect
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!data.title || !data.description || !data.category || !data.subcategory || !data.file) {
      alert("Please fill all fields and select an image");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("title", data.title);
      form.append("description", data.description);
      form.append("category", `${data.category} - ${data.subcategory}`);
      form.append("file", data.file);
      form.append("userId", user._id);

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
      <div className="w-full max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
            Upload New Project
          </h2>

          {/* Image preview section */}
          {preview && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image Preview
              </label>
              <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setData({ ...data, file: null });
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Title input */}
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

          {/* Description textarea */}
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

          {/* Category dropdown */}
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

          {/* Subcategory dropdown */}
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

          {/* File input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Image
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
                disabled={loading}
                required={!preview}
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all bg-gray-50 dark:bg-gray-700"
              >
                <div className="text-center">
                  <p className="text-4xl mb-2">📁</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {data.file ? data.file.name : "Click to upload an image"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit button */}
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