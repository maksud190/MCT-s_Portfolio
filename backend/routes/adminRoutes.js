// import express from "express";
// import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
// import {
//   // Dashboard
//   getDashboardStats,
  
//   // Users
//   getAllUsersAdmin,
//   updateUserRole,
//   blockUser,
//   deleteUser,
  
//   // Projects
//   getAllProjectsAdmin,
//   approveProject,
//   toggleFeaturedProject,
//   deleteProjectAdmin,
  
//   // Comments
//   getAllComments,
//   deleteComment,
//   flagComment,
  
//   // Announcements
//   createAnnouncement,
//   getAllAnnouncements,
//   updateAnnouncement,
//   deleteAnnouncement,
  
//   // Categories
//   createCategory,
//   getAllCategories,
//   updateCategory,
//   deleteCategory,
  
//   // Settings
//   getSiteSettings,
//   updateSiteSettings
// } from "../controllers/adminController.js";

// const router = express.Router();

// // All routes require authentication + admin role
// router.use(authMiddleware, adminMiddleware);

// // ========================================
// // 📊 DASHBOARD
// // ========================================
// router.get("/dashboard/stats", getDashboardStats);

// // ========================================
// // 👥 USERS
// // ========================================
// router.get("/users", getAllUsersAdmin);
// router.put("/users/:userId/role", updateUserRole);
// router.put("/users/:userId/block", blockUser);
// router.delete("/users/:userId", deleteUser);

// // ========================================
// // 📁 PROJECTS
// // ========================================
// router.get("/projects", getAllProjectsAdmin);
// router.put("/projects/:projectId/approve", approveProject);
// router.put("/projects/:projectId/featured", toggleFeaturedProject);
// router.delete("/projects/:projectId", deleteProjectAdmin);

// // ========================================
// // 💬 COMMENTS
// // ========================================
// router.get("/comments", getAllComments);
// router.delete("/comments/:commentId", deleteComment);
// router.put("/comments/:commentId/flag", flagComment);

// // ========================================
// // 📢 ANNOUNCEMENTS
// // ========================================
// router.post("/announcements", createAnnouncement);
// router.get("/announcements", getAllAnnouncements);
// router.put("/announcements/:announcementId", updateAnnouncement);
// router.delete("/announcements/:announcementId", deleteAnnouncement);

// // ========================================
// // 📂 CATEGORIES
// // ========================================
// router.post("/categories", createCategory);
// router.get("/categories", getAllCategories);
// router.put("/categories/:categoryId", updateCategory);
// router.delete("/categories/:categoryId", deleteCategory);

// // ========================================
// // ⚙️ SETTINGS
// // ========================================
// router.get("/settings", getSiteSettings);
// router.put("/settings", updateSiteSettings);

// export default router;























// routes/adminRoutes.js - Complete admin routes with Dashboard Stats

import express from "express";
import Project from "../models/projectModel.js";
import User from "../models/userModel.js";
import Notification from "../models/Notification.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 Admin Middleware - Verify user is admin
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ 
        message: "Access denied. Admin privileges required." 
      });
    }
    
    next();
  } catch (err) {
    console.error("Admin middleware error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔥 GET - Dashboard Statistics (MUST BE FIRST!)
router.get("/dashboard/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Get total counts
    const totalProjects = await Project.countDocuments();
    const totalUsers = await User.countDocuments();
    
    // Get approval statistics
    const pendingProjects = await Project.countDocuments({ approvalStatus: "pending" });
    const approvedProjects = await Project.countDocuments({ approvalStatus: "approved" });
    const rejectedProjects = await Project.countDocuments({ approvalStatus: "rejected" });
    const featuredProjects = await Project.countDocuments({ isFeatured: true });
    
    // Get recent projects (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentProjects = await Project.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    
    // Get total engagement
    const engagementStats = await Project.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: "$likes" },
          totalComments: { $sum: { $size: { $ifNull: ["$comments", []] } } }
        }
      }
    ]);
    
    const engagement = engagementStats[0] || {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0
    };
    
    // Get top projects
    const topProjects = await Project.find()
      .sort({ likes: -1 })
      .limit(5)
      .populate("userId", "username avatar")
      .select("title thumbnail likes views category createdAt");
    
    // Get recent pending projects
    const recentPending = await Project.find({ approvalStatus: "pending" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "username avatar")
      .select("title thumbnail category createdAt");
    
    // Response
    res.json({
      totalProjects,
      totalUsers,
      pendingProjects,
      approvedProjects,
      rejectedProjects,
      featuredProjects,
      recentProjects,
      totalViews: engagement.totalViews,
      totalLikes: engagement.totalLikes,
      totalComments: engagement.totalComments,
      topProjects,
      recentPending
    });
    
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 🔥 GET all projects (admin view - includes pending)
router.get("/projects", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = "", 
      isApproved,
      approvalStatus 
    } = req.query;

    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Approval filter (legacy support)
    if (isApproved !== undefined && isApproved !== "") {
      query.isApproved = isApproved === "true";
    }

    // Status filter (preferred)
    if (approvalStatus && approvalStatus !== "all") {
      query.approvalStatus = approvalStatus;
    }

    const projects = await Project.find(query)
      .populate("userId", "username avatar email")
      .populate("approvedBy", "username")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Project.countDocuments(query);

    // Get approval statistics
    const stats = await Project.aggregate([
      {
        $group: {
          _id: "$approvalStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      projects,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
      stats: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
    });
  } catch (err) {
    console.error("Error fetching admin projects:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔥 PUT - Approve or Reject Project
router.put(
  "/projects/:id/approve",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { isApproved, rejectionReason } = req.body;
      
      const project = await Project.findById(req.params.id)
        .populate("userId", "username email");

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const previousStatus = project.approvalStatus;

      // Update project approval status
      project.isApproved = isApproved;
      project.approvalStatus = isApproved ? "approved" : "rejected";
      project.approvedBy = req.user.id;
      project.approvedAt = new Date();

      if (!isApproved && rejectionReason) {
        project.rejectionReason = rejectionReason;
      } else if (isApproved) {
        project.rejectionReason = "";
      }

      await project.save();

      // 🔥 Create notification for project owner
      let notificationMessage;
      let notificationType;
      let notificationLink;

      if (isApproved) {
        notificationMessage = `Your project "${project.title}" has been approved and is now visible to everyone! 🎉`;
        notificationType = "project_approved";
        notificationLink = `/project/${project._id}`;
      } else {
        notificationMessage = `Your project "${project.title}" was not approved.`;
        if (rejectionReason) {
          notificationMessage += ` Reason: ${rejectionReason}`;
        }
        notificationType = "project_rejected";
        notificationLink = "/profile";
      }

      await Notification.create({
        recipient: project.userId._id,
        sender: req.user.id,
        type: notificationType,
        project: project._id,
        message: notificationMessage,
        link: notificationLink,
      });

      res.json({
        message: `Project ${isApproved ? "approved" : "rejected"} successfully`,
        project: {
          _id: project._id,
          title: project.title,
          isApproved: project.isApproved,
          approvalStatus: project.approvalStatus,
          rejectionReason: project.rejectionReason,
        },
      });
    } catch (err) {
      console.error("Error updating project approval:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// 🔥 PUT - Toggle Featured Status
router.put(
  "/projects/:id/featured",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (!project.isApproved && !project.isFeatured) {
        return res.status(400).json({
          message: "Only approved projects can be featured",
        });
      }

      project.isFeatured = !project.isFeatured;
      await project.save();

      if (project.isFeatured) {
        await Notification.create({
          recipient: project.userId,
          sender: req.user.id,
          type: "project_featured",
          project: project._id,
          message: `Your project "${project.title}" has been featured! 🌟`,
          link: `/project/${project._id}`,
        });
      }

      res.json({
        message: `Project ${project.isFeatured ? "featured" : "unfeatured"} successfully`,
        project: {
          _id: project._id,
          isFeatured: project.isFeatured,
        },
      });
    } catch (err) {
      console.error("Error toggling featured:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// 🔥 DELETE - Delete Project (Admin)
router.delete(
  "/projects/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      await Project.findByIdAndDelete(req.params.id);
      await Notification.deleteMany({ project: req.params.id });

      await Notification.create({
        recipient: project.userId,
        sender: req.user.id,
        type: "project_deleted",
        message: `Your project "${project.title}" has been removed by an admin`,
        link: "/profile",
      });

      res.json({ message: "Project deleted successfully" });
    } catch (err) {
      console.error("Error deleting project:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// 🔥 PUT - Bulk approve projects
router.put(
  "/projects/bulk/approve",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { projectIds } = req.body;

      if (!projectIds || !Array.isArray(projectIds)) {
        return res.status(400).json({ message: "Invalid project IDs" });
      }

      const result = await Project.updateMany(
        { _id: { $in: projectIds } },
        {
          $set: {
            isApproved: true,
            approvalStatus: "approved",
            approvedBy: req.user.id,
            approvedAt: new Date(),
            rejectionReason: "",
          },
        }
      );

      const projects = await Project.find({ _id: { $in: projectIds } });
      
      for (const project of projects) {
        await Notification.create({
          recipient: project.userId,
          sender: req.user.id,
          type: "project_approved",
          project: project._id,
          message: `Your project "${project.title}" has been approved! 🎉`,
          link: `/project/${project._id}`,
        });
      }

      res.json({
        message: `${result.modifiedCount} projects approved successfully`,
        modifiedCount: result.modifiedCount,
      });
    } catch (err) {
      console.error("Error bulk approving:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// 🔥 PUT - Flag/Unflag comment (Admin)
router.put(
  "/projects/:projectId/comments/:commentId/flag",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { projectId, commentId } = req.params;
      const { isFlagged, flagReason } = req.body;

      const project = await Project.findById(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const comment = project.comments.id(commentId);
      
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      comment.isFlagged = isFlagged;
      comment.flagReason = flagReason || "";
      
      await project.save();

      res.json({
        message: `Comment ${isFlagged ? "flagged" : "unflagged"} successfully`,
        comment,
      });
    } catch (err) {
      console.error("Error flagging comment:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;