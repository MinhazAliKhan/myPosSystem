const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  status: { type: String, enum: ["open", "closed"], default: "open" },
  openedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  openingNote: String,
  openingCash: { type: Number, default: 0 },
  
  // ক্যালকুলেটেড ফিল্ডসমূহ
  totalSales: { type: Number, default: 0 },
  totalTax: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 },
  totalDepositedCash: { type: Number, default: 0 },
  
  // ড্রয়ারের হিসাব ট্র্যাক করার জন্য নতুন ফিল্ড
  totalShortOver: { type: Number, default: 0 }, 
  
  closingNote: String
});

// ইনডেক্সিং যোগ করা ভালো পারফরম্যান্সের জন্য
shiftSchema.index({ openedBy: 1, startTime: -1 });

module.exports = mongoose.model("Shift", shiftSchema);