const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    unit: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    items: { type: [saleItemSchema], required: true },
    
    totalAmount: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    
    receivedAmount: { type: Number, required: true },
    changeAmount: { type: Number, required: true },
    
    paymentMethod: { 
      type: String, 
      enum: ["cash"], 
      default: "cash" 
    },

    // নতুন কানেকশন ফিল্ডস
    shift: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Shift", 
      required: true,
      index: true 
    },
    drawerSession: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "DrawerSession", 
      required: true, // এটি ছাড়া অডিট করা অসম্ভব
      index: true 
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },

    status: { 
      type: String, 
      enum: ["completed", "voided"], 
      default: "completed",
      index: true 
    },
    voidedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    voidedAt: { type: Date },
    voidReason: { type: String, trim: true }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// প্রোফিট ক্যালকুলেশনের ভার্চুয়াল ফিল্ড
saleSchema.virtual("profit").get(function () {
  return this.totalAmount - this.totalCost;
});

module.exports = mongoose.model("Sale", saleSchema);