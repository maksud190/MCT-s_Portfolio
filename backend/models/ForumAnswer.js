// // models/ForumAnswer.js
// import mongoose from "mongoose";

// const forumAnswerSchema = new mongoose.Schema(
//   {
//     question: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ForumQuestion",
//       required: true
//     },
//     author: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//     content: {
//       type: String,
//       required: true
//     },
//     images: [{
//       url: String,
//       publicId: String
//     }],
//     upvotes: [{
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User"
//     }],
//     downvotes: [{
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User"
//     }],
//     isBestAnswer: {
//       type: Boolean,
//       default: false
//     },
//     markedBestBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User"
//     },
//     // Nested replies (comments on answers)
//     replies: [{
//       author: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//       },
//       content: {
//         type: String,
//         required: true
//       },
//       images: [{
//         url: String,
//         publicId: String
//       }],
//       upvotes: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//       }],
//       createdAt: {
//         type: Date,
//         default: Date.now
//       }
//     }]
//   },
//   { timestamps: true }
// );

// // Indexes
// forumAnswerSchema.index({ question: 1, createdAt: -1 });
// forumAnswerSchema.index({ author: 1 });

// export default mongoose.model("ForumAnswer", forumAnswerSchema);

















// models/ForumAnswer.js
import mongoose from "mongoose";

const forumAnswerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumQuestion",
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true
    },
    images: [{
      url: String,
      publicId: String
    }],
    upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    downvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    isBestAnswer: {
      type: Boolean,
      default: false
    },
    markedBestBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    // 🔥 MODERATION FIELDS - ADDED FOR ADMIN FLAG FEATURE
    isFlagged: {
      type: Boolean,
      default: false
    },
    flagReason: {
      type: String,
      default: ""
    },
    // Nested replies (comments on answers)
    replies: [{
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      content: {
        type: String,
        required: true
      },
      images: [{
        url: String,
        publicId: String
      }],
      upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
);

// Indexes
forumAnswerSchema.index({ question: 1, createdAt: -1 });
forumAnswerSchema.index({ author: 1 });
forumAnswerSchema.index({ isFlagged: 1 }); // 🔥 ADDED FOR ADMIN FLAG FEATURE

export default mongoose.model("ForumAnswer", forumAnswerSchema);