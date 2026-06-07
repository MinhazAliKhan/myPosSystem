const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    // Snapshot fields: বিক্রির সময়ের ডাটা হুবহু সেভ রাখা
    name: { type: String, required: true },
    price: { type: Number, required: true }, // Selling Price
    costPrice: { type: Number, required: true }, // Profit বের করার জন্য জরুরি
    unit: { type: String, required: true }, // Unit Model এর shortName (e.g., Kg, Pcs)
    
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true }, // price * quantity
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    items: { type: [saleItemSchema], required: true },
    
    totalAmount: { type: Number, required: true }, // মোট বিক্রয় মূল্য
    totalCost: { type: Number, required: true },   // মোট কেনা দাম (ব্যাকএন্ডে ক্যালকুলেট হবে)
    
    receivedAmount: { type: Number, required: true },
    changeAmount: { type: Number, required: true },
    
    paymentMethod: { 
      type: String, 
      enum: ["cash"], // আপাতত শুধু ক্যাশ রাখছেন
      default: "cash" 
    },
    
    shift: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Shift", 
      required: true,
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
    voidedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    voidedAt: { 
      type: Date 
    },
    voidReason: { 
      type: String, 
      trim: true 
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// প্রোফিট ক্যালকুলেশনের জন্য একটি ভার্চুয়াল ফিল্ড (ঐচ্ছিক)
saleSchema.virtual("profit").get(function () {
  return this.totalAmount - this.totalCost;
});

module.exports = mongoose.model("Sale", saleSchema);