import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  credits: { type: Number, default: 15 },
  isVerified: { type: Boolean, default: false },
  verifyToken: String,
  verifyTokenExpiry: Date,
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
