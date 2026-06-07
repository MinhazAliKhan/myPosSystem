const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  status: { type: String, enum: ["open", "closed"], default: "open" },
  
  // Opening Data
  openingCash: { type: Number, default: 200 }, // রুল অনুযায়ী সবসময় ২০০ দিয়ে শুরু
  openedAt: { type: Date, default: Date.now },

  // Closing Data
  closedAt: { type: Date },
  actualCashInDrawer: { type: Number }, // ড্রয়ারে বর্তমানে কত টাকা ক্যাশ গুনে পাওয়া গেল
  expectedCash: { type: Number }, // সিস্টেম অনুযায়ী কত টাকা থাকার কথা (Opening + Sales - Void)
  difference: { type: Number }, // expectedCash এবং actualCashInDrawer এর পার্থক্য
  depositAmount: { type: Number }, // ড্রয়ারে ২০০ রেখে বাকি যে টাকাটা জমা দেওয়া হচ্ছে
  bagNumber: { type: String }, // টাকা জমা দেওয়ার ব্যাগ নম্বর

  // Summary
  totalSales: { type: Number, default: 0 },
  totalVoided: { type: Number, default: 0 },
  saleCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Shift", shiftSchema);