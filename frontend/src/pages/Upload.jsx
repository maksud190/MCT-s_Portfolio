import { useState } from "react";
import { API } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
  const [tags, setTags] = useState([]);

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
    setTags([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

    try {
      const form = new FormData();
      form.append("title", data.title);
      form.append("description", data.description);
      form.append("category", `${data.category} - ${data.subcategory}`);
      form.append("userId", user._id.toString());
      form.append("thumbnail", data.thumbnail);
      
      if (tags.length > 0) {
        form.append("tags", JSON.stringify(tags));
      }
      
      data.files.forEach((file) => {
        form.append("files", file);
      });

      console.log("📤 Uploading project:", {
        title: data.title,
        category: `${data.category} - ${data.subcategory}`,
        userId: user._id,
        thumbnail: data.thumbnail?.name,
        additionalFiles: data.files.length,
        tags: tags
      });

      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Session expired. Please login again.");
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

      toast.success("Project uploaded successfully! 🎉");

      resetForm();
      
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
      
    } catch (err) {
      console.error("❌ Upload error:", err);
      console.error("Error response:", err.response?.data);
      
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        toast.error(
          err.response?.data?.message || "Upload failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-3 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-stone-900 p-4 md:p-6 lg:p-8 rounded-sm shadow-lg">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white text-center">
            Upload New Project
          </h2>

          {/* Thumbnail Upload */}
          {thumbnailPreview ? (
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thumbnail Image <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail" 
                  className="w-full h-48 md:h-64 object-cover rounded-sm"
                />
                <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 md:px-3 py-1 rounded-sm">
                  Thumbnail
                </span>
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 md:px-3 py-1 rounded-sm hover:bg-red-700 transition-colors text-sm md:text-base"
                  disabled={loading}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                className="flex items-center justify-center w-full h-40 md:h-48 border-2 border-dashed border-stone-600 rounded-sm cursor-pointer hover:border-blue-400 transition-all bg-stone-800"
              >
                <div className="text-center">
                  <p className="text-3xl md:text-4xl mb-2">🖼️</p>
                  <p className="text-xs md:text-sm text-stone-400 font-medium">
                    Click to upload thumbnail
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Additional Images */}
          {previews.length > 0 && (
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Images ({previews.length}/4)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 md:h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white px-1.5 md:px-2 py-0.5 rounded-sm hover:bg-red-700 transition-colors text-xs md:text-sm"
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
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-stone-200 mb-2">
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
                className="flex items-center justify-center w-full p-3 md:p-4 border-2 border-dashed border-stone-600 rounded-sm cursor-pointer hover:border-blue-400 transition-all bg-stone-800"
              >
                <div className="text-center">
                  <p className="text-xl md:text-2xl mb-1">📁</p>
                  <p className="text-xs md:text-sm text-stone-500">
                    Click to add more images ({4 - data.files.length} remaining)
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Title */}
          <div className="mb-3 md:mb-4">
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full p-2 md:p-3 text-sm md:text-base border-2 border-dashed border-stone-600 rounded-sm cursor-auto dark:hover:border-blue-400 transition-all bg-stone-800 text-white"
              placeholder="Enter project title"
              disabled={loading}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3 md:mb-4">
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={data.description}
              rows="4"
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full p-2 md:p-3 text-sm md:text-base border-2 border-dashed border-stone-600 rounded-sm cursor-auto hover:border-blue-400 transition-all bg-stone-800 resize-none text-white"
              placeholder="Describe your project..."
              disabled={loading}
              required
            />
          </div>

          {/* Category */}
          <div className="mb-3 md:mb-4">
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={data.category}
              onChange={handleCategoryChange}
              className="w-full p-2 md:p-3 text-sm md:text-base border-2 border-dashed border-stone-600 rounded-sm cursor-pointer hover:border-blue-400 transition-all bg-stone-800 text-white"
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
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subcategory <span className="text-red-500">*</span>
              </label>
              <select
                value={data.subcategory}
                onChange={(e) => setData({ ...data, subcategory: e.target.value })}
                className="w-full p-2 md:p-3 text-sm md:text-base border-2 border-dashed border-stone-600 rounded-sm cursor-pointer hover:border-blue-400 transition-all bg-stone-800 text-white"
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

          {/* Tags Input Component */}
          <div className="mb-4 md:mb-6">
            <TagsInput tags={tags} setTags={setTags} />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !data.thumbnail}
            className="w-full bg-blue-600 hover:bg-stone-800 text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed text-sm md:text-base"
          >
            {loading ? "Uploading..." : !data.thumbnail ? "Select Thumbnail to Upload" : "Upload Project"}
          </button>

          {!data.thumbnail && (
            <p className="mt-2 text-xs md:text-sm text-center text-red-500">
              * Thumbnail is required
            </p>
          )}
        </form>
      </div>
    </div>
  );
}