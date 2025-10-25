const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const documentRoutes = require("./routes/documents");
const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to only allow requests from your frontend domain
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // default to localhost in dev
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400, // 24 hours
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/notes", documentRoutes);

// Health check (useful for load balancers / readiness probes)
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Handle uncaught exceptions and unhandled rejections to avoid silent failures
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err && err.stack ? err.stack : err);
  // In production you might want to exit and rely on a process manager to restart
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

// ✅ Root endpoint for quick check
app.get("/", (req, res) => {
  res.send("✅ Notes Nest backend running fine!");
});

// MongoDB Connection with retry logic
const connectDB = (retries = 5) => {
  mongoose
    .connect(process.env.MONGO_URI, {
      // MongoDB connection options for better reliability
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    .then(() => {
      console.log("✅ MongoDB Connected");
      app.listen(PORT, () => console.log(`🚀 Server running at port ${PORT}`));
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      if (retries > 0) {
        console.log(`Retrying connection... (${retries} attempts left)`);
        setTimeout(() => connectDB(retries - 1), 5000);
      } else {
        console.error("Failed to connect to MongoDB after multiple retries");
        process.exit(1);
      }
    });
};

// Initialize database connection
connectDB();

// ✅ Error handlers (optional)
process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err.stack || err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("unhandledRejection at:", promise, "reason:", reason);
});
