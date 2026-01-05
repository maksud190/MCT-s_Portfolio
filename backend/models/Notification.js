// // models/Notification.js
// import mongoose from "mongoose";

// const notificationSchema = new mongoose.Schema(
//   {
//     recipient: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User"
//     },
//     type: {
//       type: String,
//       enum: [
//         "question_answered",
//         "answer_upvoted",
//         "answer_marked_best",
//         "question_upvoted",
//         "answer_replied",
//         "mention",
        

//         "comment_flagged",
//         "comment_deleted",
//         "project_liked",
//         "project_commented",
//         "reply_received"
//       ],
//       required: true
//     },
//     question: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ForumQuestion"
//     },
//     answer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ForumAnswer"
//     },
//     message: {
//       type: String,
//       required: true
//     },
//     link: {
//       type: String
//     },

//     project: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Project"
//     },


//     isRead: {
//       type: Boolean,
//       default: false
//     },
//   },
//   { timestamps: true }
// );

// // Indexes
// notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

// export default mongoose.model("Notification", notificationSchema);

















// models/Notification.js (Update)
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    type: {
      type: String,
      enum: [
        "question_answered",
        "answer_upvoted",
        "answer_marked_best",
        "question_upvoted",
        "answer_replied",
        "mention",
        "comment_flagged",
        "comment_deleted",
        "project_liked",
        "project_commented",
        "reply_received",
        // ✅ NEW: Approval notification types
        "project_approved",
        "project_rejected",
        "project_uploaded" // For admin notification
      ],
      required: true
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumQuestion"
    },
    answer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumAnswer"
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    },
    message: {
      type: String,
      required: true
    },
    link: {
      type: String
    },
    isRead: {
      type: Boolean,
      default: false
    },
    // ✅ NEW: Additional data for approval
    rejectionReason: {
      type: String
    }
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
