const express = require("express");
const router = express.Router();
const ExcelData = require("../models/ExcelData");
const { authenticateUser } = require("../middleware/auth");

router.post("/save", authenticateUser, async (req, res) => {
  try {
    const userID = req.user.id;
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ message: "Excel data is required" });
    }

    const newEntry = new ExcelData({
      user: userID,
      data,
      uploadedAt: new Date(),
    });

    await newEntry.save();
    res.status(201).json({ message: "Data saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
