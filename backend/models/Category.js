import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      unique: true 
    },
    subcategories: [{ 
      type: String 
    }],
    icon: { 
      type: String,
      default: "📁" 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    projectCount: { 
      type: Number, 
      default: 0 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);