const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        buyingPrice: { type: Number, required: true },
        subtotal: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    note: String,
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Purchase", purchaseSchema);