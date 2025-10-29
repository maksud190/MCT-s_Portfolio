import Project from "../models/projectModel.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload new project with separate thumbnail - FIXED
export const uploadProject = async (req, res) => {
  try {
    const { title, description, category, userId } = req.body;

    // 🔥 Debug log
    console.log("📥 Upload request:", { title, category, files: req.files });

    // 🔥 req.files থেকে thumbnail এবং additional files আলাদা করা
    const thumbnailFile = req.files?.thumbnail?.[0];
    const additionalFiles = req.files?.files || [];

    // 🔥 Validation - thumbnail required
    if (!thumbnailFile) {
      return res.status(400).json({ message: "Thumbnail is required" });
    }

    // 🔥 All files একসাথে করা (thumbnail first)
    const allFiles = [thumbnailFile, ...additionalFiles];

    console.log("📁 Files to upload:", allFiles.length);

    // 🔥 Upload all images to Cloudinary
    const uploadPromises = allFiles.map((file) =>
      cloudinary.uploader.upload(file.path)
    );

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    console.log("✅ Uploaded URLs:", imageUrls);

    // 🔥 Create project
    const project = await Project.create({
      userId,
      title,
      description,
      category,
      thumbnail: imageUrls[0], // First image is thumbnail
      images: imageUrls, // All images including thumbnail
    });

    res.json({ message: "Project uploaded successfully", project });
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("userId", "username email avatar")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error("❌ Get all projects error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get user projects
export const getUserProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error("❌ Get user projects error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Get single project with all images
export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId)
      .populate("userId", "username email avatar");
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project);
  } catch (err) {
    console.error("❌ Get project by ID error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Update project - FIXED
// 🔥 Update project - FIXED with separate thumbnail handling
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, category, currentThumbnail, existingImages } = req.body;

    console.log("📝 Update request:", { 
      projectId, 
      currentThumbnail: !!currentThumbnail,
      existingImages: existingImages ? JSON.parse(existingImages).length : 0,
      files: req.files 
    });

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🔥 Parse existing additional images
    let additionalImages = [];
    try {
      additionalImages = JSON.parse(existingImages || "[]");
    } catch (err) {
      additionalImages = [];
    }

    // 🔥 Handle thumbnail
    let finalThumbnail = currentThumbnail || null;
    
    // 🔥 Check if new thumbnail uploaded
    const newThumbnailFile = req.files?.newThumbnail?.[0];
    if (newThumbnailFile) {
      const uploadResult = await cloudinary.uploader.upload(newThumbnailFile.path);
      finalThumbnail = uploadResult.secure_url;
      console.log("✅ New thumbnail uploaded:", finalThumbnail);
    }

    // 🔥 Validate thumbnail exists
    if (!finalThumbnail) {
      return res.status(400).json({ message: "Thumbnail is required" });
    }

    // 🔥 Handle additional new files
    let newAdditionalUrls = [];
    const additionalFiles = req.files?.files || [];
    
    if (additionalFiles.length > 0) {
      const uploadPromises = additionalFiles.map((file) =>
        cloudinary.uploader.upload(file.path)
      );
      const uploadResults = await Promise.all(uploadPromises);
      newAdditionalUrls = uploadResults.map((result) => result.secure_url);
      console.log("✅ New additional images uploaded:", newAdditionalUrls.length);
    }

    // 🔥 Combine all images: thumbnail first, then existing additional, then new additional
    const allImages = [
      finalThumbnail,
      ...additionalImages,
      ...newAdditionalUrls
    ];

    console.log("🖼️ Final images structure:", {
      thumbnail: finalThumbnail,
      totalImages: allImages.length
    });

    // 🔥 Update project
    project.title = title;
    project.description = description;
    project.category = category;
    project.thumbnail = finalThumbnail; // Always first image
    project.images = allImages;

    await project.save();

    console.log("✅ Project updated successfully");

    res.json({ message: "Project updated successfully", project });
  } catch (err) {
    console.error("❌ Update error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Delete project
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await Project.findByIdAndDelete(projectId);

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Like/Unlike a project
export const likeProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Please login to like projects" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const alreadyLiked = project.likedBy.includes(userId);

    if (alreadyLiked) {
      project.likedBy = project.likedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
      project.likes = Math.max(0, (project.likes || 0) - 1);
      await project.save();

      return res.json({ 
        message: "Project unliked", 
        likes: project.likes,
        isLiked: false 
      });
    } else {
      project.likedBy.push(userId);
      project.likes = (project.likes || 0) + 1;
      await project.save();

      return res.json({ 
        message: "Project liked!", 
        likes: project.likes,
        isLiked: true 
      });
    }
  } catch (err) {
    console.error("❌ Like error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Check if user has liked a project
export const checkLikeStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.json({ isLiked: false });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isLiked = project.likedBy.includes(userId);
    res.json({ isLiked, likes: project.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};