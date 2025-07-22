const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hash, role });
  console.log(user);
  await user.save();
  res.json({ msg: "User registered" });
});

router.post("/login", async (req, res) => {
    console.log("login try")
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token, user: { username: user.username, role: user.role } });
});

module.exports = router;
