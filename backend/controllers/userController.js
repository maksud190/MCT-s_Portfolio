// import User from "../models/userModel.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import cloudinary from "../config/cloudinary.js";
// import crypto from "crypto";
// import nodemailer from "nodemailer";
// import Project from "../models/projectModel.js";

// // ✅ Register
// export const register = async (req, res) => {
//   try {
//     const { username, email, password, role, designation, department } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//       role: role || "student",
//       designation: designation || "",
//       department: department || "Multimedia and Creative Technology",
//     });

//     res.status(201).json({ message: "User registered successfully", user });
//   } catch (err) {
//     console.error("❌ Register error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ Login - UPDATED to include role, designation, department
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.json({
//       token,
//       user: {
//         _id: user._id,
//         username: user.username,
//         email: user.email,
//         avatar: user.avatar,
//         bio: user.bio,
//         studentId: user.studentId,
//         batch: user.batch,
//         batchAdvisor: user.batchAdvisor,
//         batchMentor: user.batchMentor,
//         role: user.role || "student",
//         designation: user.designation || "",
//         department: user.department || "Multimedia and Creative Technology",
//         socialLinks: user.socialLinks,
//       },
//     });
//   } catch (err) {
//     console.error("❌ Login error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ Get user by ID (for other users' profiles)
// export const getUserById = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await User.findById(userId).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (err) {
//     console.error("❌ Get user error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ NEW: Get user by USERNAME (for pretty profile URLs)
// export const getUserByUsername = async (req, res) => {
//   try {
//     const { username } = req.params;

//     // Exact match – চাইলে case-insensitive করতে চাইলে নিচের regex version use করতে পারো
//     const user = await User.findOne({ username }).select("-password");

//     // Case-insensitive version (optional):
//     // const user = await User.findOne({
//     //   username: new RegExp(`^${username}$`, "i"),
//     // }).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (err) {
//     console.error("❌ Get user by username error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ Update user profile - UPDATED to handle role, designation, department
// export const updateUserProfile = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const {
//       username,
//       bio,
//       studentId,
//       batch,
//       batchAdvisor,
//       batchMentor,
//       role,
//       designation,
//       department,
//     } = req.body;

//     console.log("📝 Update profile request:", {
//       userId,
//       username,
//       role,
//       designation,
//       department,
//       hasFile: !!req.file,
//       body: req.body,
//     });

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update text fields
//     if (username) user.username = username;
//     if (bio !== undefined) user.bio = bio;
//     if (studentId !== undefined) user.studentId = studentId;
//     if (batch !== undefined) user.batch = batch;
//     if (batchAdvisor !== undefined) user.batchAdvisor = batchAdvisor;
//     if (batchMentor !== undefined) user.batchMentor = batchMentor;

//     // ✅ Update role, designation, department
//     if (role) user.role = role;
//     if (designation !== undefined) user.designation = designation;
//     if (department) user.department = department;

//     // ✅ Handle social links - Parse from JSON string
//     if (req.body.socialLinks) {
//       try {
//         const parsedSocialLinks =
//           typeof req.body.socialLinks === "string"
//             ? JSON.parse(req.body.socialLinks)
//             : req.body.socialLinks;

//         console.log("🔗 Parsed social links:", parsedSocialLinks);

//         user.socialLinks = {
//           linkedin: parsedSocialLinks.linkedin || "",
//           github: parsedSocialLinks.github || "",
//           behance: parsedSocialLinks.behance || "",
//           portfolio: parsedSocialLinks.portfolio || "",
//           twitter: parsedSocialLinks.twitter || "",
//           instagram: parsedSocialLinks.instagram || "",
//           facebook: parsedSocialLinks.facebook || "",
//         };
//       } catch (parseError) {
//         console.error("❌ Failed to parse social links:", parseError);
//       }
//     }

//     // Handle avatar upload
//     if (req.file) {
//       console.log("📁 File received, uploading to Cloudinary...");

//       try {
//         const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//           folder: "avatars",
//           transformation: [
//             { width: 500, height: 500, crop: "fill" },
//             { quality: "auto" },
//           ],
//         });

//         user.avatar = uploadResult.secure_url;
//         console.log("✅ Avatar uploaded successfully:", uploadResult.secure_url);
//       } catch (uploadError) {
//         console.error("❌ Cloudinary upload error:", uploadError);
//         return res.status(500).json({
//           message: "Failed to upload avatar",
//           error: uploadError.message,
//         });
//       }
//     }

//     await user.save();

//     console.log("✅ User saved:", {
//       role: user.role,
//       designation: user.designation,
//       department: user.department,
//       socialLinks: user.socialLinks,
//     });

//     // ✅ Include role, designation, department in response
//     const updatedUser = {
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       avatar: user.avatar || "",
//       bio: user.bio,
//       studentId: user.studentId,
//       batch: user.batch,
//       batchAdvisor: user.batchAdvisor,
//       batchMentor: user.batchMentor,
//       role: user.role,
//       designation: user.designation,
//       department: user.department,
//       socialLinks: user.socialLinks || {
//         linkedin: "",
//         github: "",
//         behance: "",
//         portfolio: "",
//         twitter: "",
//         instagram: "",
//         facebook: "",
//       },
//       isAvailableForHire: user.isAvailableForHire,
//       hourlyRate: user.hourlyRate,
//     };

//     console.log("✅ Profile updated successfully");
//     console.log("📤 Sending response:", {
//       role: updatedUser.role,
//       designation: updatedUser.designation,
//       department: updatedUser.department,
//     });

//     res.json({
//       message: "Profile updated successfully",
//       user: updatedUser,
//     });
//   } catch (err) {
//     console.error("❌ Update profile error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🔥 Feature 18: Email Verification - Send Email
// export const sendVerificationEmail = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.isEmailVerified) {
//       return res.status(400).json({ message: "Email already verified" });
//     }

//     const verificationToken = crypto.randomBytes(32).toString("hex");
//     user.emailVerificationToken = verificationToken;
//     user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
//     await user.save();

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: user.email,
//       subject: "Verify Your Email - MCT Portfolio Hub",
//       html: `
//         <h2>Email Verification</h2>
//         <p>Click the link below to verify your email:</p>
//         <a href="${verificationUrl}">${verificationUrl}</a>
//         <p>This link will expire in 24 hours.</p>
//       `,
//     });

//     res.json({ message: "Verification email sent successfully" });
//   } catch (err) {
//     console.error("Send verification email error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🔥 Feature 18: Verify Email Token
// export const verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.params;

//     const user = await User.findOne({
//       emailVerificationToken: token,
//       emailVerificationExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res
//         .status(400)
//         .json({ message: "Invalid or expired verification token" });
//     }

//     user.isEmailVerified = true;
//     user.emailVerificationToken = undefined;
//     user.emailVerificationExpires = undefined;
//     await user.save();

//     res.json({ message: "Email verified successfully" });
//   } catch (err) {
//     console.error("Verify email error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🔥 Feature 3: Follow/Unfollow User
// export const followUser = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { targetUserId } = req.params;

//     if (userId === targetUserId) {
//       return res.status(400).json({ message: "Cannot follow yourself" });
//     }

//     const currentUser = await User.findById(userId);
//     const targetUser = await User.findById(targetUserId);

//     if (!targetUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isFollowing = currentUser.following.includes(targetUserId);

//     if (isFollowing) {
//       currentUser.following = currentUser.following.filter(
//         (id) => id.toString() !== targetUserId
//       );
//       targetUser.followers = targetUser.followers.filter(
//         (id) => id.toString() !== userId
//       );

//       if (targetUser.notifications) {
//         targetUser.notifications = targetUser.notifications.filter(
//           (notif) =>
//             !(
//               notif.type === "follow" &&
//               notif.from?.toString() === userId
//             )
//         );
//       }
//     } else {
//       currentUser.following.push(targetUserId);
//       targetUser.followers.push(userId);

//       if (!targetUser.notifications) {
//         targetUser.notifications = [];
//       }

//       targetUser.notifications.push({
//         type: "follow",
//         message: `${currentUser.username} started following you`,
//         from: userId,
//       });
//     }

//     await currentUser.save();
//     await targetUser.save();

//     res.json({
//       message: isFollowing
//         ? "Unfollowed successfully"
//         : "Followed successfully",
//       isFollowing: !isFollowing,
//       followersCount: targetUser.followers.length,
//       followingCount: currentUser.following.length,
//     });
//   } catch (err) {
//     console.error("Follow user error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🔥 Feature 3: Check Follow Status
// export const checkFollowStatus = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { targetUserId } = req.params;

//     if (!userId) {
//       return res.json({ isFollowing: false });
//     }

//     const user = await User.findById(userId);
//     const isFollowing = user.following.includes(targetUserId);

//     res.json({ isFollowing });
//   } catch (err) {
//     console.error("Check follow status error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🔥 Feature 4: Get Notifications
// export const getNotifications = async (req, res) => {
//   try {
//     const userId = req.userId;

//     const user = await User.findById(userId)
//       .populate("notifications.from", "username avatar")
//       .populate("notifications.project", "title thumbnail");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (!user.notifications) {
//       user.notifications = [];
//       await user.save();
//     }

//     const notifications = user.notifications
//       .sort((a, b) => b.createdAt - a.createdAt)
//       .slice(0, 50);

//     res.json(notifications);
//   } catch (err) {
//     console.error("Get notifications error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🔥 Feature 4: Mark Notification as Read
// export const markNotificationRead = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { notificationId } = req.params;

//     const user = await User.findById(userId);
//     const notification = user.notifications.id(notificationId);

//     if (notification) {
//       notification.read = true;
//       await user.save();
//     }

//     res.json({ message: "Notification marked as read" });
//   } catch (err) {
//     console.error("Mark notification read error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🔥 Feature 4: Mark All Notifications as Read
// export const markAllNotificationsRead = async (req, res) => {
//   try {
//     const userId = req.userId;

//     await User.updateOne(
//       { _id: userId },
//       { $set: { "notifications.$[].read": true } }
//     );

//     res.json({ message: "All notifications marked as read" });
//   } catch (err) {
//     console.error("Mark all notifications read error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🔥 Feature 30: Send Contact Message (old email-based – currently route e use hocche na)
// export const sendContactMessage = async (req, res) => {
//   try {
//     const { toUserId, message, projectId } = req.body;
//     const fromUserId = req.userId;

//     const fromUser = await User.findById(fromUserId);
//     const toUser = await User.findById(toUserId);

//     if (!toUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: toUser.email,
//       subject: `New message from ${fromUser.username}`,
//       html: `
//         <h2>You have a new message</h2>
//         <p><strong>From:</strong> ${fromUser.username} (${fromUser.email})</p>
//         <p><strong>Message:</strong></p>
//         <p>${message}</p>
//         ${
//           projectId
//             ? `<p><a href="${process.env.FRONTEND_URL}/project/${projectId}">View Project</a></p>`
//             : ""
//         }
//       `,
//     });

//     res.json({ message: "Message sent successfully" });
//   } catch (err) {
//     console.error("Send contact message error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🔥 Feature 5: Update Profile Settings
// export const updateSettings = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { bio, socialLinks, skills, isAvailableForHire, hourlyRate } =
//       req.body;

//     console.log("📝 Update settings request:", {
//       userId,
//       hasCoverPhoto: !!req.file,
//     });

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (bio !== undefined) user.bio = bio;
//     if (isAvailableForHire !== undefined)
//       user.isAvailableForHire = isAvailableForHire;
//     if (hourlyRate !== undefined) user.hourlyRate = hourlyRate;

//     if (socialLinks) {
//       const links =
//         typeof socialLinks === "string"
//           ? JSON.parse(socialLinks)
//           : socialLinks;
//       user.socialLinks = {
//         linkedin: links.linkedin || "",
//         github: links.github || "",
//         behance: links.behance || "",
//         portfolio: links.portfolio || "",
//         twitter: links.twitter || "",
//         instagram: links.instagram || "",
//       };
//     }

//     if (skills) {
//       const skillsArray =
//         typeof skills === "string" ? JSON.parse(skills) : skills;
//       user.skills = skillsArray;
//     }

//     if (req.file) {
//       console.log("📁 Uploading cover photo to Cloudinary...");

//       try {
//         const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//           folder: "cover-photos",
//           transformation: [
//             { width: 1200, height: 400, crop: "fill" },
//             { quality: "auto" },
//           ],
//         });

//         user.coverPhoto = uploadResult.secure_url;
//         console.log("✅ Cover photo uploaded:", uploadResult.secure_url);
//       } catch (uploadError) {
//         console.error("❌ Cloudinary upload error:", uploadError);
//         return res.status(500).json({
//           message: "Failed to upload cover photo",
//           error: uploadError.message,
//         });
//       }
//     }

//     await user.save();

//     const updatedUser = {
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       avatar: user.avatar || "",
//       bio: user.bio,
//       coverPhoto: user.coverPhoto,
//       socialLinks: user.socialLinks,
//       skills: user.skills,
//       isAvailableForHire: user.isAvailableForHire,
//       hourlyRate: user.hourlyRate,
//       studentId: user.studentId,
//       batch: user.batch,
//       batchAdvisor: user.batchAdvisor,
//       batchMentor: user.batchMentor,
//     };

//     console.log("✅ Settings updated successfully");

//     res.json({
//       message: "Settings updated successfully",
//       user: updatedUser,
//     });
//   } catch (err) {
//     console.error("❌ Update settings error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🔥 Update Account (Username & Password)
// export const updateAccount = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { username, currentPassword, newPassword } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (username) {
//       user.username = username;
//     }

//     if (newPassword) {
//       if (!currentPassword) {
//         return res
//           .status(400)
//           .json({ message: "Current password is required" });
//       }

//       const isMatch = await bcrypt.compare(currentPassword, user.password);
//       if (!isMatch) {
//         return res
//           .status(400)
//           .json({ message: "Current password is incorrect" });
//       }

//       const hashedPassword = await bcrypt.hash(newPassword, 10);
//       user.password = hashedPassword;
//     }

//     await user.save();

//     res.json({
//       message: "Account updated successfully",
//       user: {
//         _id: user._id,
//         username: user.username,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     console.error("Update account error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🔥 Update Social Links
// export const updateSocialLinks = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { socialLinks } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.socialLinks = socialLinks;
//     await user.save();

//     res.json({
//       message: "Social links updated successfully",
//       socialLinks: user.socialLinks,
//     });
//   } catch (err) {
//     console.error("Update social links error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🔥 Delete Account
// export const deleteAccount = async (req, res) => {
//   try {
//     const userId = req.userId;

//     await Project.deleteMany({ userId });
//     await User.findByIdAndDelete(userId);

//     res.json({ message: "Account deleted successfully" });
//   } catch (err) {
//     console.error("Delete account error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🔥 Get All Users (for Profiles directory)
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find({ isActive: true })
//       .select(
//         "username email avatar bio role designation department batch studentId"
//       )
//       .sort({ role: -1, username: 1 });

//     res.json(users);
//   } catch (err) {
//     console.error("Get all users error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };



























import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Project from "../models/projectModel.js";

// ✅ helper: username validation (frontend-er sathe match)
const validateUsername = (username) => {
  return /^[a-zA-Z0-9_.]{3,20}$/.test(username);
};

// ✅ Register
export const register = async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      password,
      role,
      designation,
      department,
    } = req.body;

    if (!fullName || !username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Full name, username, email and password are required" });
    }

    if (!validateUsername(username.trim())) {
      return res.status(400).json({
        message:
          "Username must be 3–20 characters and can only contain letters, numbers, dots and underscores.",
      });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const existingUsername = await User.findOne({ username: username.trim() });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "student",
      designation: designation || "Undergraduate Student",
      department: department || "Multimedia and Creative Technology",
    });

    const safeUser = {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      designation: user.designation,
      department: user.department,
    };

    res
      .status(201)
      .json({ message: "User registered successfully", user: safeUser });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login - now supports email OR username
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // frontend theke asbe

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Identifier and password are required" });
    }

    const trimmed = identifier.trim();

    const user = await User.findOne({
      $or: [
        { email: trimmed.toLowerCase() },
        { username: trimmed },
      ],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ message: "Your account has been blocked. Contact admin." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        studentId: user.studentId,
        batch: user.batch,
        batchAdvisor: user.batchAdvisor,
        batchMentor: user.batchMentor,
        role: user.role || "student",
        designation: user.designation || "",
        department: user.department || "Multimedia and Creative Technology",
        socialLinks: user.socialLinks,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ NEW: username availability check (for real-time check)
export const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const trimmed = username.trim();

    if (!validateUsername(trimmed)) {
      return res.status(400).json({
        available: false,
        message:
          "Username must be 3–20 characters and can only contain letters, numbers, dots and underscores.",
      });
    }

    const existing = await User.findOne({ username: trimmed });

    res.json({ available: !existing });
  } catch (err) {
    console.error("❌ checkUsername error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get user by ID (for other users' profiles)
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Get user error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get user by USERNAME (for pretty profile URLs)
export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Get user by username error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update user profile - add username uniqueness + fullName support
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      fullName,
      username,
      bio,
      studentId,
      batch,
      batchAdvisor,
      batchMentor,
      role,
      designation,
      department,
    } = req.body;

    console.log("📝 Update profile request:", {
      userId,
      username,
      role,
      designation,
      department,
      hasFile: !!req.file,
      body: req.body,
    });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // full name
    if (fullName !== undefined) {
      user.fullName = fullName.trim();
    }

    // username change (unique + valid)
    if (username && username !== user.username) {
      if (!validateUsername(username.trim())) {
        return res.status(400).json({
          message:
            "Username must be 3–20 characters and can only contain letters, numbers, dots and underscores.",
        });
      }

      const existingUsername = await User.findOne({
        username: username.trim(),
        _id: { $ne: userId },
      });

      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      user.username = username.trim();
    }

    if (bio !== undefined) user.bio = bio;
    if (studentId !== undefined) user.studentId = studentId;
    if (batch !== undefined) user.batch = batch;
    if (batchAdvisor !== undefined) user.batchAdvisor = batchAdvisor;
    if (batchMentor !== undefined) user.batchMentor = batchMentor;

    // role, designation, department
    if (role) user.role = role;
    if (designation !== undefined) user.designation = designation;
    if (department) user.department = department;

    // ✅ Handle social links - Parse from JSON string
    if (req.body.socialLinks) {
      try {
        const parsedSocialLinks =
          typeof req.body.socialLinks === "string"
            ? JSON.parse(req.body.socialLinks)
            : req.body.socialLinks;

        console.log("🔗 Parsed social links:", parsedSocialLinks);

        user.socialLinks = {
          linkedin: parsedSocialLinks.linkedin || "",
          github: parsedSocialLinks.github || "",
          behance: parsedSocialLinks.behance || "",
          portfolio: parsedSocialLinks.portfolio || "",
          twitter: parsedSocialLinks.twitter || "",
          instagram: parsedSocialLinks.instagram || "",
          facebook: parsedSocialLinks.facebook || "",
        };
      } catch (parseError) {
        console.error("❌ Failed to parse social links:", parseError);
      }
    }

    // Handle avatar upload
    if (req.file) {
      console.log("📁 File received, uploading to Cloudinary...");

      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "avatars",
          transformation: [
            { width: 500, height: 500, crop: "fill" },
            { quality: "auto" },
          ],
        });

        user.avatar = uploadResult.secure_url;
        console.log("✅ Avatar uploaded successfully:", uploadResult.secure_url);
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        return res.status(500).json({
          message: "Failed to upload avatar",
          error: uploadError.message,
        });
      }
    }

    await user.save();

    console.log("✅ User saved:", {
      role: user.role,
      designation: user.designation,
      department: user.department,
      socialLinks: user.socialLinks,
    });

    const updatedUser = {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      avatar: user.avatar || "",
      bio: user.bio,
      studentId: user.studentId,
      batch: user.batch,
      batchAdvisor: user.batchAdvisor,
      batchMentor: user.batchMentor,
      role: user.role,
      designation: user.designation,
      department: user.department,
      socialLinks: user.socialLinks || {
        linkedin: "",
        github: "",
        behance: "",
        portfolio: "",
        twitter: "",
        instagram: "",
        facebook: "",
      },
      isAvailableForHire: user.isAvailableForHire,
      hourlyRate: user.hourlyRate,
    };

    console.log("✅ Profile updated successfully");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Update profile error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Feature 18: Email Verification - Send Email
export const sendVerificationEmail = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Verify Your Email - MCT Portfolio Hub",
      html: `
        <h2>Email Verification</h2>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    res.json({ message: "Verification email sent successfully" });
  } catch (err) {
    console.error("Send verification email error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Feature 18: Verify Email Token
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Feature 3: Follow/Unfollow User
export const followUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { targetUserId } = req.params;

    if (userId === targetUserId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== userId
      );

      if (targetUser.notifications) {
        targetUser.notifications = targetUser.notifications.filter(
          (notif) =>
            !(
              notif.type === "follow" &&
              notif.from?.toString() === userId
            )
        );
      }
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(userId);

      if (!targetUser.notifications) {
        targetUser.notifications = [];
      }

      targetUser.notifications.push({
        type: "follow",
        message: `${currentUser.username} started following you`,
        from: userId,
      });
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: isFollowing
        ? "Unfollowed successfully"
        : "Followed successfully",
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length,
      followingCount: currentUser.following.length,
    });
  } catch (err) {
    console.error("Follow user error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Feature 3: Check Follow Status
export const checkFollowStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const { targetUserId } = req.params;

    if (!userId) {
      return res.json({ isFollowing: false });
    }

    const user = await User.findById(userId);
    const isFollowing = user.following.includes(targetUserId);

    res.json({ isFollowing });
  } catch (err) {
    console.error("Check follow status error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Feature 4: Get Notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId)
      .populate("notifications.from", "username avatar")
      .populate("notifications.project", "title thumbnail");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.notifications) {
      user.notifications = [];
      await user.save();
    }

    const notifications = user.notifications
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 50);

    res.json(notifications);
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Feature 4: Mark Notification as Read
export const markNotificationRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { notificationId } = req.params;

    const user = await User.findById(userId);
    const notification = user.notifications.id(notificationId);

    if (notification) {
      notification.read = true;
      await user.save();
    }

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Mark notification read error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Feature 4: Mark All Notifications as Read
export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.userId;

    await User.updateOne(
      { _id: userId },
      { $set: { "notifications.$[].read": true } }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Mark all notifications read error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Feature 30: Send Contact Message (old email-based – currently route e use hocche na)
export const sendContactMessage = async (req, res) => {
  try {
    const { toUserId, message, projectId } = req.body;
    const fromUserId = req.userId;

    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);

    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toUser.email,
      subject: `New message from ${fromUser.username}`,
      html: `
        <h2>You have a new message</h2>
        <p><strong>From:</strong> ${fromUser.username} (${fromUser.email})</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        ${
          projectId
            ? `<p><a href="${process.env.FRONTEND_URL}/project/${projectId}">View Project</a></p>`
            : ""
        }
      `,
    });

    res.json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Send contact message error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Feature 5: Update Profile Settings
export const updateSettings = async (req, res) => {
  try {
    const userId = req.userId;
    const { bio, socialLinks, skills, isAvailableForHire, hourlyRate } =
      req.body;

    console.log("📝 Update settings request:", {
      userId,
      hasCoverPhoto: !!req.file,
    });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (bio !== undefined) user.bio = bio;
    if (isAvailableForHire !== undefined)
      user.isAvailableForHire = isAvailableForHire;
    if (hourlyRate !== undefined) user.hourlyRate = hourlyRate;

    if (socialLinks) {
      const links =
        typeof socialLinks === "string"
          ? JSON.parse(socialLinks)
          : socialLinks;
      user.socialLinks = {
        linkedin: links.linkedin || "",
        github: links.github || "",
        behance: links.behance || "",
        portfolio: links.portfolio || "",
        twitter: links.twitter || "",
        instagram: links.instagram || "",
      };
    }

    if (skills) {
      const skillsArray =
        typeof skills === "string" ? JSON.parse(skills) : skills;
      user.skills = skillsArray;
    }

    if (req.file) {
      console.log("📁 Uploading cover photo to Cloudinary...");

      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "cover-photos",
          transformation: [
            { width: 1200, height: 400, crop: "fill" },
            { quality: "auto" },
          ],
        });

        user.coverPhoto = uploadResult.secure_url;
        console.log("✅ Cover photo uploaded:", uploadResult.secure_url);
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        return res.status(500).json({
          message: "Failed to upload cover photo",
          error: uploadError.message,
        });
      }
    }

    await user.save();

    const updatedUser = {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      avatar: user.avatar || "",
      bio: user.bio,
      coverPhoto: user.coverPhoto,
      socialLinks: user.socialLinks,
      skills: user.skills,
      isAvailableForHire: user.isAvailableForHire,
      hourlyRate: user.hourlyRate,
      studentId: user.studentId,
      batch: user.batch,
      batchAdvisor: user.batchAdvisor,
      batchMentor: user.batchMentor,
    };

    console.log("✅ Settings updated successfully");

    res.json({
      message: "Settings updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Update settings error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Update Account (Username & Password) – with unique username check
export const updateAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const { username, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username && username !== user.username) {
      if (!validateUsername(username.trim())) {
        return res.status(400).json({
          message:
            "Username must be 3–20 characters and can only contain letters, numbers, dots and underscores.",
        });
      }

      const existingUsername = await User.findOne({
        username: username.trim(),
        _id: { $ne: userId },
      });

      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      user.username = username.trim();
    }

    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Current password is required" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "New password must be at least 6 characters" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      message: "Account updated successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Update account error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Update Social Links
export const updateSocialLinks = async (req, res) => {
  try {
    const userId = req.userId;
    const { socialLinks } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.socialLinks = socialLinks;
    await user.save();

    res.json({
      message: "Social links updated successfully",
      socialLinks: user.socialLinks,
    });
  } catch (err) {
    console.error("Update social links error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Delete Account
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;

    await Project.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Get All Users (for Profiles directory)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select(
        "fullName username email avatar bio role designation department batch studentId"
      )
      .sort({ role: -1, username: 1 });

    res.json(users);
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: err.message });
  }
};
