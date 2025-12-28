import mongoose from "mongoose";
import type { Role } from "../../types/user-types.js";

const userSchema = new mongoose.Schema(
  {
    email: { 
      type: String,
      required: true, 
      unique: true, 
      index: true, 
      trim: true, 
      lowercase: true 
    },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ["user", "admin", "scientist"] satisfies Role[] }
  },
  { timestamps: true }
);

export const UserMongoose = mongoose.model("User", userSchema);
