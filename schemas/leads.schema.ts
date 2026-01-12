import mongoose, { Schema } from "mongoose";

const LeadSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const Lead = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
