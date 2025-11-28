import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import {
  // Dashboard
  getDashboardStats,
  
  // Users
  getAllUsersAdmin,
  updateUserRole,
  blockUser,
  deleteUser,
  
  // Projects
  getAllProjectsAdmin,
  approveProject,
  toggleFeaturedProject,
  deleteProjectAdmin,
  
  // Comments
  getAllComments,
  deleteComment,
  flagComment,
  
  // Announcements
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  
  // Categories
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  
  // Settings
  getSiteSettings,
  updateSiteSettings
} from "../controllers/adminController.js";

const router = express.Router();

// All routes require authentication + admin role
router.use(authMiddleware, adminMiddleware);

// ========================================
// 📊 DASHBOARD
// ========================================
router.get("/dashboard/stats", getDashboardStats);

// ========================================
// 👥 USERS
// ========================================
router.get("/users", getAllUsersAdmin);
router.put("/users/:userId/role", updateUserRole);
router.put("/users/:userId/block", blockUser);
router.delete("/users/:userId", deleteUser);

// ========================================
// 📁 PROJECTS
// ========================================
router.get("/projects", getAllProjectsAdmin);
router.put("/projects/:projectId/approve", approveProject);
router.put("/projects/:projectId/featured", toggleFeaturedProject);
router.delete("/projects/:projectId", deleteProjectAdmin);

// ========================================
// 💬 COMMENTS
// ========================================
// router.get("/comments", getAllComments);
// router.delete("/comments/:commentId", deleteComment);
// router.put("/comments/:commentId/flag", flagComment);


// Get all comments (Admin only)
router.get("/comments", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, isFlagged } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (isFlagged !== undefined && isFlagged !== '') {
      query.isFlagged = isFlagged === 'true';
    }

    const comments = await Comment.find(query)
      .populate("user", "username avatar email")
      .populate("project", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    console.log("✅ Fetched comments for admin:", comments.length);
    res.json({ comments, totalPages, currentPage: parseInt(page), total });
  } catch (err) {
    console.error("❌ Get admin comments error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Flag/Unflag comment (Admin only)
router.put("/comments/:commentId/flag", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { isFlagged, flagReason } = req.body;

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.isFlagged = isFlagged;
    comment.flagReason = flagReason || "";
    await comment.save();

    console.log("✅ Comment flag status updated:", comment._id);
    res.json({ message: "Comment updated", comment });
  } catch (err) {
    console.error("❌ Flag comment error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Delete comment (Admin only)
router.delete("/comments/:commentId", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Remove comment from project
    await Project.findByIdAndUpdate(comment.project, {
      $pull: { comments: comment._id }
    });

    await comment.deleteOne();

    console.log("✅ Comment deleted by admin:", req.params.commentId);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("❌ Delete comment error:", err);
    res.status(500).json({ message: err.message });
  }
});





// ========================================
// 📢 ANNOUNCEMENTS
// ========================================
router.post("/announcements", createAnnouncement);
router.get("/announcements", getAllAnnouncements);
router.put("/announcements/:announcementId", updateAnnouncement);
router.delete("/announcements/:announcementId", deleteAnnouncement);

// ========================================
// 📂 CATEGORIES
// ========================================
router.post("/categories", createCategory);
router.get("/categories", getAllCategories);
router.put("/categories/:categoryId", updateCategory);
router.delete("/categories/:categoryId", deleteCategory);

// ========================================
// ⚙️ SETTINGS
// ========================================
router.get("/settings", getSiteSettings);
router.put("/settings", updateSiteSettings);

export default router;