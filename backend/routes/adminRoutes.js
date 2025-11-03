import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  deleteProjectAdmin,
  getAllReports,
  reviewReport,
  createReport,
  toggleFeaturedProject
} from "../controllers/adminController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// 🔥 Feature 16: Admin Dashboard
router.get("/dashboard/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.put("/users/:userId/toggle-status", toggleUserStatus);
router.delete("/projects/:projectId", deleteProjectAdmin);

// 🔥 Feature 16: Reports Management
router.get("/reports", getAllReports);
router.put("/reports/:reportId/review", reviewReport);
router.post("/reports", createReport); // Anyone can report
router.put("/projects/:projectId/toggle-featured", toggleFeaturedProject);

export default router;