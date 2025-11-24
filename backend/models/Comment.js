import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    project: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Project", 
      required: true 
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    text: { 
      type: String, 
      required: true 
    },
    replies: [{
      user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
      },
      text: { 
        type: String, 
        required: true 
      },
      createdAt: { 
        type: Date, 
        default: Date.now 
      }
    }],
    isApproved: { 
      type: Boolean, 
      default: true 
    },
    isFlagged: { 
      type: Boolean, 
      default: false 
    },
    flagReason: { 
      type: String 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);