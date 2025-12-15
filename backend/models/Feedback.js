import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    generalFeedback: { type: String, required: true },
    suggestions: String,
  },
  {
    collection: "feedbacks", // 🔒 important
    timestamps: true,
  }
);

export default mongoose.model("Feedback", feedbackSchema);
