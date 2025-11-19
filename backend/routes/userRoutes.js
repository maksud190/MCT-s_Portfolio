// backend/routes/userRoutes.js

import express from "express";
import multer from "multer";
import { 
  register, 
  login, 
  getUserById, 
  updateUserProfile,
  sendVerificationEmail,
  verifyEmail,
  followUser,
  checkFollowStatus,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  sendContactMessage,
  updateAccount,
  updateSocialLinks,
  deleteAccount,
  getAllUsers  // ✅ Import this
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// ✅ PUBLIC ROUTES
router.post("/register", register);
router.post("/login", login);

// ✅ IMPORTANT: Put /all route BEFORE /:userId route
router.get("/all", getAllUsers);

// ✅ Then specific ID routes
router.get("/:userId", getUserById);



// ✅ PROTECTED ROUTES
router.put("/profile", authMiddleware, upload.single('avatar'), updateUserProfile);

// Settings routes
router.put("/account", authMiddleware, updateAccount);
router.put("/social-links", authMiddleware, updateSocialLinks);
router.delete("/account", authMiddleware, deleteAccount);

// Email Verification
router.post("/send-verification-email", authMiddleware, sendVerificationEmail);
router.get("/verify-email/:token", verifyEmail);

// Follow System
router.post("/follow/:targetUserId", authMiddleware, followUser);
router.get("/follow-status/:targetUserId", authMiddleware, checkFollowStatus);

// Notifications
router.get("/notifications/all", authMiddleware, getNotifications);
router.put("/notifications/:notificationId/read", authMiddleware, markNotificationRead);
router.put("/notifications/read-all", authMiddleware, markAllNotificationsRead);

// Contact/Hire Me
router.post("/contact", authMiddleware, sendContactMessage);

export default router;