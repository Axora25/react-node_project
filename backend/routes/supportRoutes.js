import express from "express";
import Support from "../models/supportModel.js";

const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newSupport = new Support({ name, email, message });
    await newSupport.save();

    res.json({ success: true, message: "Support request submitted!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
