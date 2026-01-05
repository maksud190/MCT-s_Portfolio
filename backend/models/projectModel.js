// // models/projectModel.js - UPDATE comments schema

// import mongoose from "mongoose";

// const projectSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     title: { type: String, required: true },
//     description: { type: String },
//     category: { type: String },
//     thumbnail: { type: String, required: true },
//     images: [{ type: String }],

//     // Tags System
//     tags: [{ type: String }],

//     // Collaborative Projects
//     collaborators: [
//       {
//         user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         role: { type: String, default: "Contributor" },
//       },
//     ],

//     // Engagement
//     likes: { type: Number, default: 0 },
//     likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     views: { type: Number, default: 0 },

//     // Analytics
//     viewHistory: [
//       {
//         date: { type: Date, default: Date.now },
//         count: { type: Number, default: 1 },
//       },
//     ],

//     // 🔥 Comments System (UPDATED with flag fields)
//     comments: [
//       {
//         user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         text: { type: String, required: true },
//         // 🔥 NEW: Flag system
//         isFlagged: { type: Boolean, default: false },
//         flagReason: { type: String, default: "" },
//         replies: [
//           {
//             user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//             text: { type: String, required: true },
//             createdAt: { type: Date, default: Date.now },
//           },
//         ],
//         createdAt: { type: Date, default: Date.now },
//         updatedAt: { type: Date, default: Date.now },
//       },
//     ],

//     // SEO
//     metaTitle: { type: String },
//     metaDescription: { type: String },
//     metaKeywords: [{ type: String }],
//     slug: { type: String, unique: true, sparse: true },

//     // Status
//     isPublished: { type: Boolean, default: true },
//     isFeatured: { type: Boolean, default: false },
//     isApproved: { type: Boolean, default: true },
//     approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     approvedAt: { type: Date },
//   },
//   { timestamps: true }
// );

// // Auto-generate slug from title
// projectSchema.pre("save", function (next) {
//   if (this.isModified("title") && !this.slug) {
//     this.slug =
//       this.title
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, "-")
//         .replace(/(^-|-$)/g, "") +
//       "-" +
//       Date.now();
//   }
//   next();
// });

// export default mongoose.model("Project", projectSchema);

// models/projectModel.js - UPDATED with Approval System

import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    thumbnail: { type: String, required: true },
    images: [{ type: String }],

    // Tags System
    tags: [{ type: String }],

    // Collaborative Projects
    collaborators: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, default: "Contributor" },
      },
    ],

    // Engagement
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },

    // Analytics
    viewHistory: [
      {
        date: { type: Date, default: Date.now },
        count: { type: Number, default: 1 },
      },
    ],

    // 🔥 Comments System (with flag fields)
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        // Flag system
        isFlagged: { type: Boolean, default: false },
        flagReason: { type: String, default: "" },
        replies: [
          {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
          },
        ],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],

    // SEO
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],
    slug: { type: String, unique: true, sparse: true },

    // Status
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },

    
    // 🔥 APPROVAL SYSTEM (UPDATED)
    isApproved: {
      type: Boolean,
      default: false, // ✅ This should be FALSE (not true)
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // ✅ This should be "pending"
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from title
projectSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now();
  }
  next();
});

// 🔥 NEW: Indexes for better query performance
projectSchema.index({ userId: 1 });
projectSchema.index({ isApproved: 1, createdAt: -1 });
projectSchema.index({ approvalStatus: 1 });
projectSchema.index({ category: 1, isApproved: 1 });
projectSchema.index({ slug: 1 });
projectSchema.index({ isFeatured: 1, isApproved: 1 });

// 🔥 NEW: Method to check if user can view project
projectSchema.methods.canBeViewedBy = function (userId) {
  // If project is approved, anyone can view
  if (this.isApproved) return true;

  // If not approved, only owner can view
  if (userId && this.userId.toString() === userId.toString()) return true;

  return false;
};

export default mongoose.model("Project", projectSchema);
