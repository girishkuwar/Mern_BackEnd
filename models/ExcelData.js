const mongoose = require("mongoose");

const excelDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileName: String,
  data: { type: Array, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ExcelData", excelDataSchema);
