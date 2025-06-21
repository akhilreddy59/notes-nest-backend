const Document = require("../models/Document");

// POST /upload - User uploads a document
const uploadDocument = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const { title, subject, contributor, driveLink, category } = req.body;
    const filePath = req.file ? req.file.path : null;

    if (!filePath) {
      return res.status(400).json({ error: "File is missing" });
    }

    const newDoc = new Document({
      title,
      subject,
      contributor,
      driveLink,
      category,
      file: filePath,
      status: "pending",
    });

    await newDoc.save();
    res.status(201).json({ message: "Submitted for admin approval." });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// GET /approved - Get all approved documents
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

// GET /pending - Get all pending documents (for admin)
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

// PATCH /approve/:id - Admin approves a document
const approveDocument = async (req, res) => {
  try {
    const { id } = req.params;
    await Document.findByIdAndUpdate(id, { status: "approved" });
    res.json({ message: "Document approved." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fs = require("fs");
const path = require("path");

const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: "Note not found" });
    }

    // ✅ Delete file from uploads folder
    const filePath = path.join(__dirname, "..", "uploads", doc.file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // ✅ Delete from DB
    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: "Note and file deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting document:", err);
    res.status(500).json({ error: "Server error during deletion." });
  }
};

module.exports = {
  uploadDocument,
  getApprovedDocuments,
  getPendingDocuments,
  approveDocument,
  deleteDocument, // ✅ Make sure this is exported
};
