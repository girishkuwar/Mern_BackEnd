const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  canCreateAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
