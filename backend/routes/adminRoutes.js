// import express from "express";
// import {
//   getDashboardStats,
//   getAllUsers,
//   toggleUserStatus,
//   deleteProjectAdmin,
//   getAllReports,
//   reviewReport,
//   createReport,
//   toggleFeaturedProject
// } from "../controllers/adminController.js";
// import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // All admin routes require authentication + admin role
// router.use(authMiddleware);
// router.use(adminMiddleware);

// // 🔥 Feature 16: Admin Dashboard
// router.get("/dashboard/stats", getDashboardStats);
// router.get("/users", getAllUsers);
// router.put("/users/:userId/toggle-status", toggleUserStatus);
// router.delete("/projects/:projectId", deleteProjectAdmin);

// // 🔥 Feature 16: Reports Management
// router.get("/reports", getAllReports);
// router.put("/reports/:reportId/review", reviewReport);
// router.post("/reports", createReport); // Anyone can report
// router.put("/projects/:projectId/toggle-featured", toggleFeaturedProject);

// export default router;












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
router.get("/comments", getAllComments);
router.delete("/comments/:commentId", deleteComment);
router.put("/comments/:commentId/flag", flagComment);

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