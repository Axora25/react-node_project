import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

// --------------------
// SUBMIT FEEDBACK (unchanged)
// --------------------
router.post("/submit", async (req, res) => {
  try {
    const { fullName, email, generalFeedback, suggestions } = req.body;

    const feedback = new Feedback({
      fullName,
      email,
      generalFeedback,
      suggestions,
    });

    await feedback.save();

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// --------------------
// GET FEEDBACKS (for testimonials)
// --------------------
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .select("fullName generalFeedback createdAt");

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
});

export default router;
