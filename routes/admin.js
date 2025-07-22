const express = require("express");
const { auth, adminOnly } = require("../middleware/auth");
const Upload = require("../models/Upload");
const router = express.Router();

// Get all upload history
router.get("/uploads", auth, adminOnly, async (req, res) => {
  try {
    const uploads = await Upload.find().populate("uploadedBy", "username email").sort({ uploadedAt: -1 });
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching uploads" });
  }
});

module.exports = router;
