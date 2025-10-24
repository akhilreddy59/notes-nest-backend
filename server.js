const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// 🧩 Import controller functions
const {
  uploadDocument,
  getApprovedDocuments,
  getPendingDocuments,
  approveDocument,
  deleteDocument,
  adminLogin, // ✅ added
} = require("./controllers/documentController");

const documentRoutes = require("./routes/documents"); // ✅ routes file
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded files publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.post("/api/admin/login", adminLogin); // ✅ admin login
app.use("/api/notes", documentRoutes);

// ✅ Root endpoint for quick check
app.get("/", (req, res) => {
  res.send("✅ Notes Nest backend running fine!");
});

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

// ✅ Error handlers (optional)
process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err.stack || err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("unhandledRejection at:", promise, "reason:", reason);
});
