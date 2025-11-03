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
  sendContactMessage
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

// ✅ Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/:userId", getUserById);

// ✅ Protected routes
router.put("/profile", authMiddleware, upload.single('avatar'), updateUserProfile);

// 🔥 Feature 18: Email Verification
router.post("/send-verification-email", authMiddleware, sendVerificationEmail);
router.get("/verify-email/:token", verifyEmail);

// 🔥 Feature 3: Follow System
router.post("/follow/:targetUserId", authMiddleware, followUser);
router.get("/follow-status/:targetUserId", authMiddleware, checkFollowStatus);

// 🔥 Feature 4: Notifications - FIX: Move before /:userId route
router.get("/notifications/all", authMiddleware, getNotifications); // Changed path
router.put("/notifications/:notificationId/read", authMiddleware, markNotificationRead);
router.put("/notifications/read-all", authMiddleware, markAllNotificationsRead);

// 🔥 Feature 30: Contact/Hire Me
router.post("/contact", authMiddleware, sendContactMessage);

export default router;