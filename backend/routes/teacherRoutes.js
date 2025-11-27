import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Announcement from "../models/Announcement.js";

const router = express.Router();

// Middleware to check if user is teacher
const teacherMiddleware = (req, res, next) => {
  if (req.user?.role !== "teacher") {
    return res.status(403).json({ message: "Access denied. Teachers only." });
  }
  next();
};

// Get all announcements created by the teacher
router.get("/announcements", authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const announcements = await Announcement.find({ createdBy: req.userId })
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (err) {
    console.error("❌ Get teacher announcements error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Create announcement
router.post("/announcements", authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const { title, content, type, isActive, expiresAt } = req.body;

    const announcement = new Announcement({
      title,
      content,
      type,
      isActive,
      expiresAt: expiresAt || null,
      createdBy: req.userId
    });

    await announcement.save();

    res.status(201).json({ message: "Announcement created", announcement });
  } catch (err) {
    console.error("❌ Create announcement error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Update announcement
router.put("/announcements/:announcementId", authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const announcement = await Announcement.findOne({
      _id: req.params.announcementId,
      createdBy: req.userId
    });

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found or unauthorized" });
    }

    const updates = req.body;
    Object.assign(announcement, updates);
    await announcement.save();

    res.json({ message: "Announcement updated", announcement });
  } catch (err) {
    console.error("❌ Update announcement error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Delete announcement
router.delete("/announcements/:announcementId", authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const announcement = await Announcement.findOneAndDelete({
      _id: req.params.announcementId,
      createdBy: req.userId
    });

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found or unauthorized" });
    }

    res.json({ message: "Announcement deleted" });
  } catch (err) {
    console.error("❌ Delete announcement error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;