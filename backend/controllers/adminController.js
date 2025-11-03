import User from "../models/userModel.js";
import Project from "../models/projectModel.js";
import Report from "../models/reportModel.js";

// 🔥 Feature 16: Get Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalViews = await Project.aggregate([
      { $group: { _id: null, total: { $sum: "$views" } } }
    ]);
    const totalLikes = await Project.aggregate([
      { $group: { _id: null, total: { $sum: "$likes" } } }
    ]);
    const pendingReports = await Report.countDocuments({ status: "pending" });
    
    // Recent users
    const recentUsers = await User.find()
      .select('username email avatar createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Recent projects
    const recentProjects = await Project.find()
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Most viewed projects
    const topProjects = await Project.find()
      .populate('userId', 'username avatar')
      .sort({ views: -1 })
      .limit(5);
    
    res.json({
      stats: {
        totalUsers,
        totalProjects,
        totalViews: totalViews[0]?.total || 0,
        totalLikes: totalLikes[0]?.total || 0,
        pendingReports
      },
      recentUsers,
      recentProjects,
      topProjects
    });
  } catch (err) {
    console.error("Get dashboard stats error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Feature 16: Get All Users (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalUsers: total
    });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Feature 16: Ban/Unban User
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({ 
      message: user.isActive ? "User activated" : "User banned",
      isActive: user.isActive
    });
  } catch (err) {
    console.error("Toggle user status error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Feature 16: Delete Project (Admin)
export const deleteProjectAdmin = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete project admin error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Feature 16: Get All Reports
export const getAllReports = async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    
    const reports = await Report.find({ status })
      .populate('reportedBy', 'username email avatar')
      .populate('reviewedBy', 'username')
      .sort({ createdAt: -1 });
    
    res.json(reports);
  } catch (err) {
    console.error("Get all reports error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Feature 16: Review Report
export const reviewReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, reviewNote } = req.body;
    const adminId = req.userId;
    
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    
    report.status = status;
    report.reviewNote = reviewNote;
    report.reviewedBy = adminId;
    await report.save();
    
    res.json({ message: "Report reviewed successfully", report });
  } catch (err) {
    console.error("Review report error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Feature 16: Create Report
export const createReport = async (req, res) => {
  try {
    const { reportedItem, itemType, reason, description } = req.body;
    const reportedBy = req.userId;
    
    const report = await Report.create({
      reportedBy,
      reportedItem,
      itemType,
      reason,
      description
    });
    
    res.json({ message: "Report submitted successfully", report });
  } catch (err) {
    console.error("Create report error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Feature 16: Toggle Featured Project
export const toggleFeaturedProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    project.isFeatured = !project.isFeatured;
    await project.save();
    
    res.json({ 
      message: project.isFeatured ? "Project featured" : "Project unfeatured",
      isFeatured: project.isFeatured
    });
  } catch (err) {
    console.error("Toggle featured project error:", err);
    res.status(500).json({ message: err.message });
  }
};