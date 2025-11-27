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
  getAllUsers
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

// 🔥 Import Contact model and User model
import Contact from "../models/contactModel.js";
import User from "../models/userModel.js";

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

// 🔥 CONTACT MESSAGES ROUTES
// ⚠️ IMPORTANT: Specific routes MUST come BEFORE generic routes

// Get received messages (inbox)
router.get("/contact/inbox", authMiddleware, async (req, res) => {
  try {
    console.log("📥 Fetching inbox for user:", req.userId);
    
    const messages = await Contact.find({ recipientId: req.userId })
      .populate("senderId", "username email avatar designation")
      .populate("projectId", "title thumbnail")
      .sort({ createdAt: -1 });

    console.log("✅ Found messages:", messages.length);
    res.json(messages);
  } catch (error) {
    console.error("❌ Get inbox error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get sent messages (outbox)
router.get("/contact/sent", authMiddleware, async (req, res) => {
  try {
    console.log("📤 Fetching sent messages for user:", req.userId);
    
    const messages = await Contact.find({ senderId: req.userId })
      .populate("recipientId", "username email avatar designation")
      .populate("projectId", "title thumbnail")
      .sort({ createdAt: -1 });

    console.log("✅ Found sent messages:", messages.length);
    res.json(messages);
  } catch (error) {
    console.error("❌ Get sent messages error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get unread count
router.get("/contact/unread-count", authMiddleware, async (req, res) => {
  try {
    const count = await Contact.countDocuments({
      recipientId: req.userId,
      isRead: false,
    });

    console.log("📊 Unread count for user", req.userId, ":", count);
    res.json({ count });
  } catch (error) {
    console.error("❌ Get unread count error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Mark message as read
router.patch("/contact/:messageId/read", authMiddleware, async (req, res) => {
  try {
    const message = await Contact.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only recipient can mark as read
    if (message.recipientId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    message.isRead = true;
    await message.save();

    console.log("✅ Message marked as read:", req.params.messageId);
    res.json({ message: "Message marked as read" });
  } catch (error) {
    console.error("❌ Mark as read error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete message
router.delete("/contact/:messageId", authMiddleware, async (req, res) => {
  try {
    const message = await Contact.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only sender or recipient can delete
    if (
      message.senderId.toString() !== req.userId &&
      message.recipientId.toString() !== req.userId
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await message.deleteOne();

    console.log("✅ Message deleted:", req.params.messageId);
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("❌ Delete message error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Send contact message (THIS MUST BE LAST)
router.post("/contact", authMiddleware, async (req, res) => {
  try {
    const { recipientId, projectId, subject, message } = req.body;

    console.log("📧 Contact request received:", { 
      senderId: req.userId, 
      recipientId, 
      projectId, 
      subject 
    });

    // Validation
    if (!recipientId || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Prevent sending message to self
    if (req.userId === recipientId) {
      return res.status(400).json({ message: "You cannot send a message to yourself" });
    }

    // Create contact message
    const contact = new Contact({
      senderId: req.userId,
      recipientId,
      projectId: projectId || null,
      subject: subject.trim(),
      message: message.trim(),
    });

    await contact.save();
    await contact.populate("senderId", "username email avatar");

    console.log("✅ Contact message saved:", contact._id);

    res.status(201).json({
      message: "Message sent successfully",
      contact,
    });
  } catch (error) {
    console.error("❌ Contact message error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;