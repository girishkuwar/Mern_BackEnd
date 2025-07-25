const express = require("express");
const { auth, adminOnly } = require("../middleware/auth");
const Upload = require("../models/Upload");
const router = express.Router();
const User = require('../models/User');
const ExcelsData = require('../models/ExcelData');

// Get all upload history
router.get("/uploads", auth, adminOnly, async (req, res) => {
  try {
    const uploads = await Upload.find().populate("uploadedBy", "username email").sort({ uploadedAt: -1 });
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching uploads" });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalUploads = await ExcelsData.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true }); // optional field
    res.json({ totalUsers, activeUsers , totalUploads });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
