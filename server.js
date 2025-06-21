const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Important for handling form fields

// ✅ Serve uploaded files publicly (optional but useful)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
const documentRoutes = require("./routes/documents");
app.use("/api/notes", documentRoutes);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
