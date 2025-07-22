const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const Upload = require('../models/Upload');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});

const upload = multer({ storage });

// Middleware (optional): verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, etc. }
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// POST /api/upload
router.post('/', verifyToken, upload.single('excel'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).send("No file uploaded");

    // Parse Excel headers
    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const columns = jsonData[0];

    const newUpload = new Upload({
      userId: req.user.id,
      fileName: file.originalname,
      filePath: file.path,
      sheetNames: workbook.SheetNames,
      columns,
    });

    await newUpload.save();
    res.status(200).json({ message: "File uploaded & saved", upload: newUpload });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
