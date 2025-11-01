import Project from "../models/projectModel.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Upload new project - FIXED
export const uploadProject = async (req, res) => {
  try {
    const { title, description, category, userId } = req.body;

    console.log("📥 Upload request received:", { 
      title, 
      category, 
      userId,
      userIdType: typeof userId,
      files: req.files 
    });




    // 🔥 Strict validation
    if (!userId || userId === "undefined" || userId === "null") {
      return res.status(400).json({ message: "User ID is required and must be valid" });
    }

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // 🔥 Get files
    const thumbnailFile = req.files?.thumbnail?.[0];
    const additionalFiles = req.files?.files || [];

    // 🔥 Thumbnail required
    if (!thumbnailFile) {
      return res.status(400).json({ message: "Thumbnail is required" });
    }

    // 🔥 Upload files
    const allFiles = [thumbnailFile, ...additionalFiles];
    console.log("📁 Uploading files:", allFiles.length);

    const uploadPromises = allFiles.map((file) =>
      cloudinary.uploader.upload(file.path)
    );

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    console.log("✅ Cloudinary upload complete:", imageUrls.length);

    // 🔥 Create project
    const project = await Project.create({
      userId: userId.trim(), // Remove any whitespace
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      thumbnail: imageUrls[0],
      images: imageUrls,
    });

   console.log("✅ Project created successfully:", project._id);

    res.json({ 
      message: "Project uploaded successfully", 
      project 
    });
 } catch (err) {
    console.error("❌ Upload error:", err);
    console.error("Error details:", {
      message: err.message,
      name: err.name,
      code: err.code
    });

    res.status(500).json({ 
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err.toString() : undefined
    });
  }
};

// ✅ Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("userId", "username email avatar")
      .sort({ createdAt: -1 });

    console.log("📦 Fetched projects:", projects.length);
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

    console.log("📦 Fetching projects for user:", userId);

    const projects = await Project.find({ userId })
      .populate("userId", "username email avatar")
      .sort({ createdAt: -1 });

    console.log("✅ Found projects:", projects.length);
    res.json(projects);
  } catch (err) {
    console.error("❌ Get user projects error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get single project
export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).populate(
      "userId",
      "username email avatar"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    console.error("❌ Get project error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Increment view
export const incrementView = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.views = (project.views || 0) + 1;
    await project.save();

    res.json({ message: "View counted", views: project.views });
  } catch (err) {
    console.error("❌ View error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update project
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, category, currentThumbnail, existingImages } =
      req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    let additionalImages = [];
    try {
      additionalImages = JSON.parse(existingImages || "[]");
    } catch (err) {
      additionalImages = [];
    }

    let finalThumbnail = currentThumbnail || null;

    const newThumbnailFile = req.files?.newThumbnail?.[0];
    if (newThumbnailFile) {
      const uploadResult = await cloudinary.uploader.upload(
        newThumbnailFile.path
      );
      finalThumbnail = uploadResult.secure_url;
    }

    if (!finalThumbnail) {
      return res.status(400).json({ message: "Thumbnail is required" });
    }

    let newAdditionalUrls = [];
    const additionalFiles = req.files?.files || [];

    if (additionalFiles.length > 0) {
      const uploadPromises = additionalFiles.map((file) =>
        cloudinary.uploader.upload(file.path)
      );
      const uploadResults = await Promise.all(uploadPromises);
      newAdditionalUrls = uploadResults.map((result) => result.secure_url);
    }

    const allImages = [
      finalThumbnail,
      ...additionalImages,
      ...newAdditionalUrls,
    ];

    project.title = title;
    project.description = description;
    project.category = category;
    project.thumbnail = finalThumbnail;
    project.images = allImages;

    await project.save();

    res.json({ message: "Project updated successfully", project });
  } catch (err) {
    console.error("❌ Update error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete project
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

// 🔥 Like/Unlike
export const likeProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    console.log("❤️ Like request:", { projectId, userId });

    if (!userId) {
      return res.status(401).json({ message: "Please login to like" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const alreadyLiked = project.likedBy.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      project.likedBy = project.likedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
      project.likes = Math.max(0, (project.likes || 0) - 1);
      await project.save();

      console.log("💔 Unliked");
      return res.json({
        message: "Unliked",
        likes: project.likes,
        isLiked: false,
      });
    } else {
      project.likedBy.push(userId);
      project.likes = (project.likes || 0) + 1;
      await project.save();

      console.log("❤️ Liked");
      return res.json({
        message: "Liked!",
        likes: project.likes,
        isLiked: true,
      });
    }
  } catch (err) {
    console.error("❌ Like error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Check like status
export const checkLikeStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    if (!userId) {
      const project = await Project.findById(projectId);
      return res.json({ isLiked: false, likes: project?.likes || 0 });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isLiked = project.likedBy.some(
      (id) => id.toString() === userId.toString()
    );
    res.json({ isLiked, likes: project.likes });
  } catch (err) {
    console.error("❌ Check like error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
