const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema({
  refundDate: { type: Date, default: Date.now },
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: "Sale" , required: false}, // কোন সেল থেকে ফেরত এলো
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,
      quantity: Number,
      price: Number,
      subtotal: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  reason: { type: String, required: true }, // রিফান্ড কেন হচ্ছে
}, { timestamps: true });

module.exports = mongoose.model("Refund", refundSchema);