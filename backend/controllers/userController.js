import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js"; // 🔥 Import cloudinary

// Register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        studentId: user.studentId,
        batch: user.batch,
        batchAdvisor: user.batchAdvisor,
        batchMentor: user.batchMentor,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (err) {
    console.error("❌ Get user error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Update user profile - FIXED
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { username, bio, studentId, batch, batchAdvisor, batchMentor } = req.body;

    console.log("📝 Update profile request:", {
      userId,
      username,
      hasFile: !!req.file,
      fileName: req.file?.originalname,
      fileSize: req.file?.size,
      filePath: req.file?.path
    });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update text fields
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (studentId !== undefined) user.studentId = studentId;
    if (batch !== undefined) user.batch = batch;
    if (batchAdvisor !== undefined) user.batchAdvisor = batchAdvisor;
    if (batchMentor !== undefined) user.batchMentor = batchMentor;

    // Handle avatar upload
    if (req.file) {
      console.log("📁 File received, uploading to Cloudinary...");
      console.log("File details:", {
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
      
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "avatars",
          transformation: [
            { width: 500, height: 500, crop: "fill" },
            { quality: "auto" }
          ]
        });
        
        user.avatar = uploadResult.secure_url;
        console.log("✅ Avatar uploaded successfully:", uploadResult.secure_url);
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        console.error("Upload error details:", uploadError.message);
        return res.status(500).json({ 
          message: "Failed to upload avatar",
          error: uploadError.message 
        });
      }
    } else {
      console.log("⚠️ No file in request");
    }

    await user.save();
    console.log("✅ User saved to database");

    const updatedUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar || "",
      bio: user.bio,
      studentId: user.studentId,
      batch: user.batch,
      batchAdvisor: user.batchAdvisor,
      batchMentor: user.batchMentor,
    };

    console.log("📤 Sending response with avatar:", updatedUser.avatar);

    res.json({ 
      message: "Profile updated successfully", 
      user: updatedUser 
    });
  } catch (err) {
    console.error("❌ Update profile error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err.toString() : undefined
    });
  }
};







