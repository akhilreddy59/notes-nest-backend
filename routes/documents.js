const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  uploadDocument,
  getApprovedDocuments,
  getPendingDocuments,
  approveDocument,
  deleteDocument,
  adminLogin,
} = require("../controllers/documentController");

// ✅ Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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
router.get("/pending", getPendingDocuments);
router.patch("/approve/:id", approveDocument);
router.delete("/delete/:id", deleteDocument);

module.exports = router;
