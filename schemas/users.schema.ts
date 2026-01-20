import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    credits: { type: Number, default: 15 },
    isVerified: { type: Boolean, default: false },
    verifyToken: String,
    verifyTokenExpiry: Date,
    plan: {
      type: String,
      enum: ["free", "pro", "lifetime"],
      default: "free",
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ verifyToken: 1 });
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
