const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  status: { type: String, enum: ["open", "closed"], default: "open" },
  openedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  openingNote: String,
  openingCash: Number,
  totalSales: { type: Number, default: 0 },
  totalTax: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 },
  totalDepositedCash: { type: Number, default: 0 },
  closingNote: String
});

module.exports = mongoose.model("Shift", shiftSchema);