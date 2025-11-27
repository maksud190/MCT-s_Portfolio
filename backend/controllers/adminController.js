import User from "../models/userModel.js";
import Project from "../models/projectModel.js";
import Comment from "../models/Comment.js";
import Announcement from "../models/Announcement.js";
import Category from "../models/Category.js";
import SiteSettings from "../models/SiteSettings.js";
import Report from "../models/reportModel.js";

// ========================================
// 📊 DASHBOARD STATS
// ========================================

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Total counts
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalComments = await Comment.countDocuments();
    const pendingReports = await Report.countDocuments({ status: "pending" });

    // New this week
    const newUsersWeek = await User.countDocuments({ 
      createdAt: { $gte: lastWeek } 
    });
    const newProjectsWeek = await Project.countDocuments({ 
      createdAt: { $gte: lastWeek } 
    });

    // New this month
    const newUsersMonth = await User.countDocuments({ 
      createdAt: { $gte: lastMonth } 
    });
    const newProjectsMonth = await Project.countDocuments({ 
      createdAt: { $gte: lastMonth } 
    });

    // Most viewed projects
    const mostViewedProjects = await Project.find()
      .sort({ views: -1 })
      .limit(5)
      .populate("userId", "username avatar");

    // Most liked projects
    const mostLikedProjects = await Project.find()
      .sort({ likes: -1 })
      .limit(5)
      .populate("userId", "username avatar");

    // User growth (last 7 days)
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: lastWeek }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalUsers,
      totalProjects,
      totalComments,
      pendingReports,
      newUsersWeek,
      newProjectsWeek,
      newUsersMonth,
      newProjectsMonth,
      mostViewedProjects,
      mostLikedProjects,
      userGrowth
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================
// 👥 USER MANAGEMENT
// ========================================

export const getAllUsersAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", role = "" } = req.query;

    const query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    res.json({ message: "User role updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true }
    ).select("-password");

    res.json({ 
      message: isBlocked ? "User blocked" : "User unblocked", 
      user 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete user's projects
    await Project.deleteMany({ userId });

    // Delete user's comments
    await Comment.deleteMany({ user: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: "User and all associated data deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================
// 📁 PROJECT MANAGEMENT
// ========================================

export const getAllProjectsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", isApproved = "" } = req.query;

    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    
    if (isApproved !== "") {
      query.isApproved = isApproved === "true";
    }

    const projects = await Project.find(query)
      .populate("userId", "username email avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Project.countDocuments(query);

    res.json({
      projects,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { isApproved } = req.body;

    const project = await Project.findByIdAndUpdate(
      projectId,
      { 
        isApproved,
        approvedBy: req.userId,
        approvedAt: new Date()
      },
      { new: true }
    ).populate("userId", "username email");

    res.json({ 
      message: isApproved ? "Project approved" : "Project rejected", 
      project 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleFeaturedProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    project.isFeatured = !project.isFeatured;
    await project.save();

    res.json({ 
      message: project.isFeatured ? "Project featured" : "Project unfeatured", 
      project 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProjectAdmin = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Delete comments associated with project
    await Comment.deleteMany({ project: projectId });

    // Delete project
    await Project.findByIdAndDelete(projectId);

    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================
// 💬 COMMENT MODERATION
// ========================================

export const getAllComments = async (req, res) => {
  try {
    const { page = 1, limit = 20, isFlagged = "" } = req.query;

    const query = {};
    if (isFlagged !== "") {
      query.isFlagged = isFlagged === "true";
    }

    const comments = await Comment.find(query)
      .populate("user", "username avatar")
      .populate("project", "title")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Comment.countDocuments(query);

    res.json({
      comments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    await Comment.findByIdAndDelete(commentId);

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const flagComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { isFlagged, flagReason } = req.body;

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { isFlagged, flagReason },
      { new: true }
    );

    res.json({ message: "Comment updated", comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================
// 📢 ANNOUNCEMENTS
// ========================================

export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, type, expiresAt } = req.body;

    const announcement = new Announcement({
      title,
      content,
      type,
      expiresAt,
      createdBy: req.userId
    });

    await announcement.save();

    res.json({ message: "Announcement created", announcement });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;
    const updates = req.body;

    const announcement = await Announcement.findByIdAndUpdate(
      announcementId,
      updates,
      { new: true }
    );

    res.json({ message: "Announcement updated", announcement });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;

    await Announcement.findByIdAndDelete(announcementId);

    res.json({ message: "Announcement deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================
// 📂 CATEGORIES
// ========================================

export const createCategory = async (req, res) => {
  try {
    const { name, subcategories, icon } = req.body;

    const category = new Category({
      name,
      subcategories,
      icon
    });

    await category.save();

    res.json({ message: "Category created", category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const updates = req.body;

    const category = await Category.findByIdAndUpdate(
      categoryId,
      updates,
      { new: true }
    );

    res.json({ message: "Category updated", category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    await Category.findByIdAndDelete(categoryId);

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================
// ⚙️ SITE SETTINGS
// ========================================

export const getSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      settings = new SiteSettings();
      await settings.save();
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSiteSettings = async (req, res) => {
  try {
    const updates = req.body;

    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      settings = new SiteSettings(updates);
    } else {
      Object.assign(settings, updates);
    }

    await settings.save();

    res.json({ message: "Settings updated", settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};