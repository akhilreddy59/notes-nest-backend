const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const verifyToken = require("../middleware/verifyToken");

const {
  uploadDocument,
  getApprovedDocuments,
  getPendingDocuments,
  approveDocument,
  deleteDocument,
  adminLogin,
} = require("../controllers/documentController");

// Ensure uploads directory exists and use an absolute path for storage destination
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`);
  },
});

const upload = multer({ storage });

// ✅ Route with `upload.single()` and proper field parsing
// Accept an optional file under the field name 'file'. Controller will handle file vs driveLink.
router.post("/upload", upload.single("file"), uploadDocument);

// Admin login route (returns JWT)
router.post("/admin/login", express.json(), adminLogin);

router.get("/approved", getApprovedDocuments);
// The following routes are admin-only and require a valid JWT in the Authorization header (Bearer <token>)
router.get("/pending", verifyToken, getPendingDocuments);
router.patch("/approve/:id", verifyToken, approveDocument);
router.delete("/delete/:id", verifyToken, deleteDocument);

module.exports = router;
