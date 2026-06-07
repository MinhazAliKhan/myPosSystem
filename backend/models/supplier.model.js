const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  address: { type: String, trim: true },
  contactPerson: { type: String, trim: true },
  isDeleted: { type: Boolean, default: false },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

// ইউনিকনেস চেক (শুধুমাত্র একটিভ ডাটার জন্য)
supplierSchema.index({ name: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });
supplierSchema.index({ phone: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });
supplierSchema.index({ phone: "text", name: "text" });
module.exports = mongoose.model("Supplier", supplierSchema);