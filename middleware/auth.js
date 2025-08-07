const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ msg: "Token not valid" });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admins only" });
  }
  next();
}

const authenticateUser = (req, res, next) => {
  const authheader = req.headers.authorization;

  if (!authheader || !authheader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  const token = authheader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ msg: "Unauthorized: Invalid token" });
  }
};

module.exports = { auth, adminOnly, authenticateUser };
