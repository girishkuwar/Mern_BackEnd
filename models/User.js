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
  status : {
    type:String,
    enum : ['active','inactive'],
    default: "inactive"
  },
  canCreateAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
