const mongoose = require("mongoose");

const expenseItemSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  note: { type: String, trim: true }
}, { _id: false });

const expenseSchema = new mongoose.Schema({
  drawerSession: { type: mongoose.Schema.Types.ObjectId, ref: "DrawerSession", required: false },
  shift: { type: mongoose.Schema.Types.ObjectId, ref: "Shift", required: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expenses: { type: [expenseItemSchema], required: true }, // Array of objects
  totalAmount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);