// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import userRoutes from "./routes/userRoutes.js";
// import projectRoutes from "./routes/projectRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import contactRoutes from "./routes/contactRoutes.js";
// import teacherRoutes from "./routes/teacherRoutes.js";
// import forumRoutes from "./routes/forumRoutes.js";
// import categoryRoutes from "./routes/categoryRoutes.js";
// import adminforumroutes from "./routes/adminforumroutes.js";
// import testimonialRoutes from "./routes/testimonialRoutes.js";


// dotenv.config();

// const app = express();

// // Create uploads directory
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const uploadsDir = path.join(__dirname, 'uploads');

// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
//   console.log("✅ Created uploads directory");
// }

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Request logging
// app.use((req, res, next) => {
//   console.log(`\n🌐 ${req.method} ${req.url}`);
//   next();
// });

// // ✅ Routes
// app.use("/api/users", userRoutes);
// app.use("/api/projects", projectRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/admin", adminforumroutes);
// app.use("/api/contact", contactRoutes);
// app.use("/api/teacher", teacherRoutes);
// app.use("/api/forum", forumRoutes);
// app.use("/api/categories", categoryRoutes);

// app.use("/api/testimonials", testimonialRoutes);


// // Database connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB Error:", err));

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });






















import express from "express";
import Project from "../backend/models/projectModel.js";
import User from "../backend/models/userModel.js";
import Notification from "../backend/models/Notification.js";
import { authMiddleware } from "../backend/middleware/authMiddleware.js";

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

// 🔥 GET - Dashboard Statistics (ADD THIS ROUTE!)
router.get("/dashboard/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    console.log("📊 Dashboard stats route hit!");
    
    // Calculate date for "this week"
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get total counts
    console.log("Fetching total users...");
    const totalUsers = await User.countDocuments();
    
    console.log("Fetching total projects...");
    const totalProjects = await Project.countDocuments();
    
    console.log("Fetching new users this week...");
    const newUsersWeek = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });

    console.log("Fetching new projects this week...");
    const newProjectsWeek = await Project.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });

    console.log("Calculating total comments...");
    const commentsResult = await Project.aggregate([
      { 
        $project: { 
          commentCount: { 
            $size: { $ifNull: ["$comments", []] } 
          } 
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: "$commentCount" } 
        } 
      }
    ]);
    const totalComments = commentsResult[0]?.total || 0;

    // Placeholder for reports (implement if you have a Report model)
    const pendingReports = 0;

    console.log("Fetching most viewed projects...");
    const mostViewedProjects = await Project.find({ isApproved: true })
      .sort({ views: -1 })
      .limit(5)
      .populate("userId", "username avatar")
      .select("title thumbnail views userId")
      .lean();

    console.log("Fetching most liked projects...");
    const mostLikedProjects = await Project.find({ isApproved: true })
      .sort({ likes: -1 })
      .limit(5)
      .populate("userId", "username avatar")
      .select("title thumbnail likes userId")
      .lean();

    console.log("✅ All dashboard data fetched successfully!");

    res.json({
      totalUsers,
      totalProjects,
      totalComments,
      pendingReports,
      newUsersWeek,
      newProjectsWeek,
      mostViewedProjects,
      mostLikedProjects
    });

  } catch (err) {
    console.error("❌ Dashboard stats error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      message: "Server error",
      error: err.message
    });
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
        project.rejectionReason = ""; // Clear any previous rejection reason
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

      // 🔥 Only approved projects can be featured
      if (!project.isApproved && !project.isFeatured) {
        return res.status(400).json({
          message: "Only approved projects can be featured",
        });
      }

      project.isFeatured = !project.isFeatured;
      await project.save();

      // Notify project owner if featured
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

      // Delete project
      await Project.findByIdAndDelete(req.params.id);

      // Delete associated notifications
      await Notification.deleteMany({ project: req.params.id });

      // Notify project owner
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

// 🔥 GET - Get project statistics (Admin Dashboard)
router.get("/projects/stats/overview", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const stats = await Project.aggregate([
      {
        $facet: {
          totalProjects: [{ $count: "count" }],
          approvalStatus: [
            {
              $group: {
                _id: "$approvalStatus",
                count: { $sum: 1 },
              },
            },
          ],
          featuredProjects: [
            {
              $match: { isFeatured: true },
            },
            { $count: "count" },
          ],
          recentProjects: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
              },
            },
            { $count: "count" },
          ],
          topProjects: [
            { $sort: { likes: -1 } },
            { $limit: 5 },
            {
              $project: {
                title: 1,
                likes: 1,
                views: 1,
                thumbnail: 1,
              },
            },
          ],
        },
      },
    ]);

    const result = stats[0];
    
    res.json({
      totalProjects: result.totalProjects[0]?.count || 0,
      pending: result.approvalStatus.find((s) => s._id === "pending")?.count || 0,
      approved: result.approvalStatus.find((s) => s._id === "approved")?.count || 0,
      rejected: result.approvalStatus.find((s) => s._id === "rejected")?.count || 0,
      featured: result.featuredProjects[0]?.count || 0,
      recentWeek: result.recentProjects[0]?.count || 0,
      topProjects: result.topProjects,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

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

      // Create notifications for all approved projects
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