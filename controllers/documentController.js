const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const Document = require("../models/Document");

// ✅ POST /upload - User uploads a document (via Drive Link only)
const uploadDocument = async (req, res) => {
  try {
    console.log("Upload Request:", req.body);

    const { title, subject, contributor, driveLink, category } = req.body;

    if (!title || !subject || !contributor || !category) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const uploadedFile = req.file ? req.file.path : null;

    if (!driveLink && !uploadedFile) {
      return res
        .status(400)
        .json({ error: "Either driveLink or a file upload is required." });
    }

    const newDoc = new Document({
      title,
      subject,
      contributor,
      driveLink: driveLink || null,
      category,
      file: uploadedFile,
      status: "pending",
    });

    await newDoc.save();
    res.status(201).json({ message: "✅ Submitted for admin approval." });
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    res.status(500).json({ error: "Server error during upload." });
  }
};

// ✅ GET /approved - Get all approved documents
const getApprovedDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ status: "approved" }).sort({
      createdAt: -1,
    });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET /pending - Get all pending documents (admin)
const getPendingDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ PATCH /approve/:id - Admin approves a document
const approveDocument = async (req, res) => {
  try {
    const { id } = req.params;
    await Document.findByIdAndUpdate(id, { status: "approved" });
    res.json({ message: "✅ Document approved." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE /delete/:id - Admin deletes a document
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (doc.file) {
      const filePath = path.isAbsolute(doc.file)
        ? doc.file
        : path.join(__dirname, "..", doc.file);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.warn(`Unable to delete file at ${filePath}:`, err.message);
        } else {
          console.log(`Deleted file: ${filePath}`);
        }
      });
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Note deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting document:", err.message);
    res.status(500).json({ error: "Server error during deletion." });
  }
};

// ✅ POST /admin/login - simple admin authentication that returns a JWT
const adminLogin = (req, res) => {
  const { password } = req.body || {};

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminPassword || !jwtSecret) {
    console.error("ADMIN_PASSWORD or JWT_SECRET not set in environment");
    return res.status(500).json({ message: "Server configuration error." });
  }

  if (password !== adminPassword) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "8h" });
  return res.json({ token });
};

// ✅ Export all together
module.exports = {
  uploadDocument,
  getApprovedDocuments,
  getPendingDocuments,
  approveDocument,
  deleteDocument,
  adminLogin, // added here
};
