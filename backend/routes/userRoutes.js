import express from "express";
import multer from "multer";
import { register, login, getUserById, updateUserProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 IMPORTANT: Multer config with detailed logging
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("📁 Multer: Setting destination to uploads/");
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    console.log("📁 Multer: Generating filename:", uniqueSuffix + '-' + file.originalname);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    console.log("🔍 Multer: Checking file type:", file.mimetype);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'), false);
    }
  }
});

// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/:userId", getUserById);

// 🔥 Protected route - Update profile with detailed logging
router.put("/profile", 
  (req, res, next) => {
    console.log("🔵 Route hit: PUT /api/users/profile");
    console.log("Headers:", req.headers);
    next();
  },
  authMiddleware, 
  (req, res, next) => {
    console.log("🔵 After auth middleware, userId:", req.userId);
    next();
  },
  upload.single('avatar'),
  (req, res, next) => {
    console.log("🔵 After multer middleware");
    console.log("File received:", req.file);
    console.log("Body received:", req.body);
    next();
  },
  updateUserProfile
);

export default router;