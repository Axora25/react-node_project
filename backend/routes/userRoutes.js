import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `profile-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
});

router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      farmName: user.farmName,
      farmSize: user.farmSize,
      location: user.location,
      profileImage: user.profileImage,
      createdAt: user.createdAt
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

router.put('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.farmName = req.body.farmName || user.farmName;
    user.farmSize = req.body.farmSize || user.farmSize;
    user.location = req.body.location || user.location;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      farmName: updatedUser.farmName,
      farmSize: updatedUser.farmSize,
      location: updatedUser.location,
      profileImage: updatedUser.profileImage
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

router.post('/profile/image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload an image' });
    const user = await User.findById(req.user._id);
    if (user) {
      user.profileImage = `/uploads/${req.file.filename}`;
      await user.save();
      res.json({ profileImage: user.profileImage });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
