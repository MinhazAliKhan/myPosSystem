const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Product name is required"], 
      trim: true, 
      index: true 
    },
    // URL friendly name (e.g., "samsung-galaxy-s23")
    slug: {
      type: String,
      lowercase: true,
      trim: true
    },
    sku: { 
      type: String, 
      unique: true, 
      trim: true,
      required: [true, "SKU or Barcode is required"], // POS এর জন্য SKU সাধারণত জরুরি
      index: true
    },
    price: { 
      type: Number, 
      required: [true, "Selling price is required"], 
      min: [0, "Price cannot be negative"] 
    },
    costPrice: { 
      type: Number, 
      min: [0, "Cost price cannot be negative"],
      default: 0 
    },
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category", 
      required: [true, "Category is required"],
      index: true 
    },
    brand: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Brand", 
      required: [true, "Brand is required"],
      index: true 
    },
    unit: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Unit", 
      required: [true, "Unit is required"] 
    },
    stock: { 
      type: Number, 
      default: 0, 
      min: [0, "Stock cannot be negative"] 
    },
    lowStockLevel: { 
      type: Number, 
      default: 5 
    },
    isActive: { 
      type: Boolean, 
      default: true,
      index: true 
    },
    isDeleted: { 
      type: Boolean, 
      default: false, 
      index: true, // সার্চ পারফরম্যান্সের জন্য ইনডেক্স প্রয়োজন
      select: false 
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    updatedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    deletedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Search Optimization
productSchema.index({ name: "text", sku: "text" });

// ক্যাটাগরি বা ব্র্যান্ড ওয়াইজ ফিল্টার করার জন্য কম্পাউন্ড ইনডেক্স (পারফরম্যান্স বুস্ট করবে)
productSchema.index({ category: 1, isDeleted: 1 });
productSchema.index({ brand: 1, isDeleted: 1 });

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);