import { useState, useEffect } from "react";
import { API } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import TagsInput from "../components/TagsInput";

export default function EditProject() {
  const { projectId } = useParams();
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
  });
  const [currentThumbnail, setCurrentThumbnail] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [newThumbnail, setNewThumbnail] = useState(null);
  const [newThumbnailPreview, setNewThumbnailPreview] = useState(null);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    API.get(`/projects/${projectId}`)
      .then((res) => {
        const project = res.data;
        
        if (project.userId._id !== user._id) {
          alert("You can only edit your own projects!");
          navigate("/profile");
          return;
        }

        const [mainCat, subCat] = project.category.split(" - ");
        
        setData({
          title: project.title,
          description: project.description,
          category: mainCat || "",
          subcategory: subCat || "",
        });
        
        if (project.tags) {
          setTags(project.tags);
        }
        
        if (project.images && project.images.length > 0) {
          setCurrentThumbnail(project.images[0]);
          setExistingImages(project.images.slice(1));
        }
        
        setFetchLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
        alert("Failed to load project");
        navigate("/profile");
      });
  }, [projectId, user._id, navigate]);

  const removeCurrentThumbnail = () => {
    if (!newThumbnail && existingImages.length === 0 && newFiles.length === 0) {
      alert("Project must have at least one image. Please add a new thumbnail before removing this one.");
      return;
    }

    if (!newThumbnail) {
      alert("Please upload a new thumbnail before removing the current one.");
      return;
    }

    if (window.confirm("Remove current thumbnail? You have selected a new thumbnail to replace it.")) {
      setCurrentThumbnail(null);
    }
  };

  const removeExistingImage = (index) => {
    if (!currentThumbnail && !newThumbnail && existingImages.length === 1 && newFiles.length === 0) {
      alert("Project must have at least one image.");
      return;
    }

    if (window.confirm("Remove this image?")) {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please select an image file");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setNewThumbnail(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewThumbnailPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeNewThumbnail = () => {
    if (!currentThumbnail && existingImages.length === 0 && newFiles.length === 0) {
      alert("Project must have at least one image");
      return;
    }
    setNewThumbnail(null);
    setNewThumbnailPreview(null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const thumbnailCount = (currentThumbnail ? 1 : 0) + (newThumbnail ? 1 : 0);
    const totalImages = thumbnailCount + existingImages.length + newFiles.length + files.length;
    
    if (totalImages > 5) {
      alert(`Maximum 5 images allowed. Current total: ${thumbnailCount + existingImages.length + newFiles.length}`);
      return;
    }

    const validFiles = [];
    const previews = [];

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image`);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large`);
        return;
      }

      validFiles.push(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === validFiles.length) {
          setNewPreviews([...newPreviews, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setNewFiles([...newFiles, ...validFiles]);
  };

  const removeNewFile = (index) => {
    const thumbnailCount = (currentThumbnail ? 1 : 0) + (newThumbnail ? 1 : 0);
    if (thumbnailCount === 0 && existingImages.length === 0 && newFiles.length === 1) {
      alert("Project must have at least one image");
      return;
    }
    setNewFiles(newFiles.filter((_, i) => i !== index));
    setNewPreviews(newPreviews.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (e) => {
    setData({ ...data, category: e.target.value, subcategory: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!data.title || !data.description || !data.category || !data.subcategory) {
      alert("Please fill all fields");
      return;
    }

    if (!currentThumbnail && !newThumbnail) {
      alert("Thumbnail is required. Please upload a thumbnail.");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("title", data.title);
      form.append("description", data.description);
      form.append("category", `${data.category} - ${data.subcategory}`);
      
      if (tags.length > 0) {
        form.append("tags", JSON.stringify(tags));
      }
      
      form.append("currentThumbnail", currentThumbnail || "");
      form.append("existingImages", JSON.stringify(existingImages));
      
      if (newThumbnail) {
        form.append("newThumbnail", newThumbnail);
      }
      
      newFiles.forEach((file) => {
        form.append("files", file);
      });

      console.log("Update data:", {
        currentThumbnail: !!currentThumbnail,
        newThumbnail: !!newThumbnail,
        existingImages: existingImages.length,
        newFiles: newFiles.length
      });

      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Please login again");
        navigate("/login");
        return;
      }

      await API.put(`/projects/${projectId}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      alert("✅ Project updated successfully!");
      navigate("/profile");
      
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ " + (err.response?.data?.message || "Update failed"));
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // ✅ DEFINE THESE VARIABLES BEFORE RETURN
  const thumbnailCount = (currentThumbnail ? 1 : 0) + (newThumbnail ? 1 : 0);
  const totalImages = thumbnailCount + existingImages.length + newFiles.length;
  const canAddMore = totalImages < 5;
  const hasThumbnail = currentThumbnail || newThumbnail;

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Project
            </h2>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-500"
            >
              ← Back
            </button>
          </div>

          {/* Current Thumbnail */}
          {currentThumbnail && !newThumbnail && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Thumbnail
              </label>
              <div className="relative w-full h-64">
                <img src={currentThumbnail} alt="Current Thumbnail" className="w-full h-full object-cover rounded-lg" />
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                  Current Thumbnail
                </div>
                <button
                  type="button"
                  onClick={removeCurrentThumbnail}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  title="Remove current thumbnail"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* New Thumbnail Preview */}
          {newThumbnailPreview && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Thumbnail {currentThumbnail && "(will replace current)"}
              </label>
              <div className="relative w-full h-64">
                <img src={newThumbnailPreview} alt="New Thumbnail" className="w-full h-full object-cover rounded-lg" />
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                  New Thumbnail
                </div>
                <button
                  type="button"
                  onClick={removeNewThumbnail}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Upload New Thumbnail */}
          {!newThumbnailPreview && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {currentThumbnail ? "Replace Thumbnail (Optional)" : "Upload Thumbnail *"}
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
                    Click to {currentThumbnail ? "replace" : "upload"} thumbnail
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Existing Additional Images */}
          {existingImages.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Images ({existingImages.length})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img} alt={`Additional ${index + 1}`} className="w-full h-40 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Additional Images Preview */}
          {newPreviews.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Additional Images ({newPreviews.length})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {newPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img src={preview} alt={`New ${index + 1}`} className="w-full h-40 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeNewFile(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Additional Images */}
          {canAddMore && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add More Images ({totalImages}/5)
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
                    Click to add more images ({5 - totalImages} remaining)
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
              <option value="">Select category</option>
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
                <option value="">Select subcategory</option>
                {categories[data.category].map((subcat) => (
                  <option key={subcat} value={subcat}>{subcat}</option>
                ))}
              </select>
            </div>
          )}

          {/* Tags Input */}
          <div className="mb-6">
            <TagsInput tags={tags} setTags={setTags} />
          </div>

          {/* Warning if no thumbnail */}
          {!hasThumbnail && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-300">
                ⚠️ Thumbnail is required. Please upload a thumbnail.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !hasThumbnail}
              className="flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : !hasThumbnail ? "Thumbnail Required" : "Update Project"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}