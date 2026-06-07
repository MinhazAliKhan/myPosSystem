const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true, index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    quantity: { type: Number, required: true },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
    buyingPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ["Pending", "Received", "Returned"],
      default: "Received" 
    },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);