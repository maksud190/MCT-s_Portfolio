

import express from "express";
import multer from "multer";
import {
  uploadProject,
  getAllProjects,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  likeProject,
  checkLikeStatus // 🔥 New import
} from "../controllers/projectController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // 🔥 Import করা

const router = express.Router();
const upload = multer({ dest: "uploads/" });



// 🔥 Update project - separate thumbnail and files
router.put("/:projectId", upload.fields([
  { name: 'newThumbnail', maxCount: 1 }, // 🔥 New thumbnail (optional)
  { name: 'files', maxCount: 4 } // 🔥 Additional files
]), updateProject);


// ✅ All projects
router.get("/", getAllProjects);

// ✅ Specific user's projects
router.get("/user/:userId", getUserProjects);

// ✅ Get single project by ID
router.get("/:projectId", getProjectById);

// 🔥 Update project
router.put("/:projectId", upload.array("files", 5), updateProject);

// 🔥 Delete project
router.delete("/:projectId", deleteProject);

// 🔥 Like/Unlike route - authMiddleware দিয়ে protect করা
router.post("/:projectId/like", authMiddleware, likeProject);

// 🔥 Check like status - optional auth (user না থাকলেও কাজ করবে)
router.get("/:projectId/like-status", (req, res, next) => {
  // Token optional - থাকলে decode করবে, না থাকলে skip করবে
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    return authMiddleware(req, res, next);
  }
  req.userId = null;
  next();
}, checkLikeStatus);

export default router;