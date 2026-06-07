const mongoose = require("mongoose");

const wasteSchema = new mongoose.Schema(
  {
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product", 
      required: true,
      index: true 
    },
    quantity: { 
      type: Number, 
      required: true 
    },
    // এখানে String এর বদলে Unit টেবিলের সাথে Join করা হয়েছে
    unit: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Unit", // আপনার Unit মডেলের নাম যদি "Unit" হয়
      required: true 
    },
    reason: { 
      type: String, 
      required: true, 
      enum: ["Expired", "Damaged", "Lost", "Theft", "Other"] 
    },
    costPriceAtTime: { 
      type: Number, 
      required: true 
    }, // সে সময়ের কেনা দাম
    totalLossValue: { 
      type: Number, 
      required: true 
    }, // quantity * costPrice
    recordedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    note: { 
      type: String, 
      trim: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Waste", wasteSchema);