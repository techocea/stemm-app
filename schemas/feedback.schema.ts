import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
});
export const Feedback =
  mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
