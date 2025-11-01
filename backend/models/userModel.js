// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   avatar: { type: String, default: "" },
//   bio: { type: String, default: "" }
// }, { timestamps: true });

// export default mongoose.model("User", userSchema);



import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" }, // Profile picture URL
  bio: { type: String, default: "" },
  
  // 🔥 New student details fields
  studentId: { type: String, default: "" },
  batch: { type: String, default: "" },
  idCardImage: { type: String, default: "" }, // ID card photo URL
  batchAdvisor: { type: String, default: "" },
  batchMentor: { type: String, default: "" },
  
  // 🔥 Role for admin access
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);