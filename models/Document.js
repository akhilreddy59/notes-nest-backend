const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    contributor: { type: String, required: true },
    category: { type: String, required: true },
    driveLink: { type: String, required: true },
    file: { type: String, required: false },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// ✅ THIS is the missing part:
module.exports = mongoose.model("Document", documentSchema);
