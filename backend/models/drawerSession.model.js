const mongoose = require("mongoose");

const drawerSessionSchema = new mongoose.Schema({
  shiftId: { type: mongoose.Schema.Types.ObjectId, ref: "Shift", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["active", "cashed-out"], default: "active" },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  openingCash: { type: Number, default: 0 },
  drawerSales: { type: Number, default: 0 },
  drawerTax: { type: Number, default: 0 },
  drawerExpenses: { type: Number, default: 0 },
  actualCashEntered: Number,
  bagNumber: String,
  shortOver: Number
});

module.exports = mongoose.model("DrawerSession", drawerSessionSchema);