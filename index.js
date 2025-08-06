const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const uploadRoute = require('./routes/UploadRoute');
const excelRoute = require('./routes/excelRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Access uploaded files

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/upload', uploadRoute);
app.use('/api/excel', excelRoute);




app.listen(5000, () => console.log("Server started on port 5000"));
