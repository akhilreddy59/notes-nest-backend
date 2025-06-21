const Document = require("../models/Document");

// ✅ POST /upload - User uploads a document (via Drive Link only)
const uploadDocument = async (req, res) => {
  try {
    console.log("Upload Request:", req.body);

    const { title, subject, contributor, driveLink, category } = req.body;

    if (!title || !subject || !contributor || !driveLink || !category) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const newDoc = new Document({
      title,
      subject,
      contributor,
      driveLink,
      category,
      file: null, // No local file
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

    // ❌ No file deletion (Drive Link only)
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Note deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting document:", err.message);
    res.status(500).json({ error: "Server error during deletion." });
  }
};

module.exports = {
  uploadDocument,
  getApprovedDocuments,
  getPendingDocuments,
  approveDocument,
  deleteDocument,
};
