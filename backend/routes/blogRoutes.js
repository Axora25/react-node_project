import express from "express";
import multer from "multer";
import path from "path";
import Blog from "../models/Blog.js";

const router = express.Router();

/* -------------------- Multer Config -------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* -------------------- CREATE BLOG -------------------- */
router.post("/", upload.single("imageFile"), async (req, res) => {
  try {
    const { title, content, imageUrl, tags } = req.body;

    let finalImage = imageUrl || "";

    if (req.file) {
      finalImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const newBlog = new Blog({
      title,
      content,
      image: finalImage,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : []
    });

    await newBlog.save();
    res.status(201).json(newBlog);

  } catch (error) {
    console.error("Create Blog Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------- GET ALL BLOGS -------------------- */
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error("Fetch Blogs Error:", error);
    res.status(500).json({ message: "Error fetching blogs" });
  }
});

/* -------------------- GET SINGLE BLOG -------------------- */
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error("Fetch Single Blog Error:", error);
    res.status(500).json({ message: "Error fetching blog" });
  }
});

export default router;
