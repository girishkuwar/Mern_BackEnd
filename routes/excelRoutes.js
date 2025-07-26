const express = require("express");
const router = express.Router();
const ExcelData = require("../models/ExcelData");
const { authenticateUser } = require("../middleware/auth");
const { default: mongoose } = require("mongoose");

router.post("/save", authenticateUser, async (req, res) => {
  try {
    const userID = req.user.id;
    const { data, name } = req.body;

    if (!data) {
      return res.status(400).json({ message: "Excel data is required" });
    }

    const newEntry = new ExcelData({
      user: userID,
      fileName: name,
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

router.get("/getsheets", authenticateUser, async (req, res) => {
  try {
    const userID = req.user.id;
    const uploads = await ExcelData.find({ user: userID }, { data: 0 }).sort({
      uploadedAt: -1,
    });
    res.status(200).json(uploads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const upload = await ExcelData.findById(req.params.id);

    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }
    if (upload.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({
      data: upload.data,
      name: upload.fileName,
      createdAt: upload.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
