const mongoose = require("mongoose");
const Purchase = require("../models/purchase.model");
const Product = require("../models/product.model");
const Supplier = require("../models/supplier.model");

// ১. বাল্ক পারচেজ রিসিভ করা (স্টক ও কেনা দাম আপডেটসহ)
exports.receiveBulkPurchase = async (data, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const supplier = await Supplier.findOne({ _id: data.supplier, isDeleted: false }).session(session);
    if (!supplier) throw new Error("Selected supplier is inactive or not found");

    const purchaseEntries = [];

    for (const item of data.items) {
      const product = await Product.findOne({ _id: item.product, isDeleted: false }).session(session);
      if (!product) throw new Error(`Product not found: ${item.product}`);

      const rowTotal = Number(item.quantity) * Number(item.buyingPrice);

      purchaseEntries.push({
        supplier: data.supplier,
        product: item.product,
        quantity: item.quantity,
        unit: item.unit,
        buyingPrice: item.buyingPrice,
        totalAmount: rowTotal,
        status: data.status,
        recordedBy: userId,
        note: item.note || ""
      });

      // স্টক এবং লেটেস্ট কস্ট প্রাইস আপডেট (Status Received হলে)
      if (data.status === "Received") {
        product.stock += Number(item.quantity);
        product.costPrice = Number(item.buyingPrice);
        product.updatedBy = userId;
        await product.save({ session });
      }
    }

    const results = await Purchase.insertMany(purchaseEntries, { session });
    await session.commitTransaction();
    return results;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// ২. সব পারচেজ দেখা (Search, Filter by Date & Supplier, Pagination)
exports.getAllPurchases = async (queries) => {
  const { supplier, status, startDate, endDate, page = 1, limit = 50 } = queries;
  let filter = {};

  // সাপ্লায়ার ফিল্টার
  if (supplier) filter.supplier = supplier;
  
  // স্ট্যাটাস ফিল্টার
  if (status) filter.status = status;

  // তারিখ অনুযায়ী ফিল্টার (শুরু থেকে শেষ পর্যন্ত)
  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate + "T00:00:00.000Z"),
      $lte: new Date(endDate + "T23:59:59.999Z"),
    };
  }

  const skip = (Number(page) - 1) * Number(limit);

  // ডাটা ফেচিং এবং টোটাল সামারি ক্যালকুলেশন
  const [purchases, total, reportSummary] = await Promise.all([
    Purchase.find(filter)
      .populate("supplier", "name phone")
      .populate("product", "name")
      .populate("unit", "name")
      .populate("recordedBy", "name")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit)),
    Purchase.countDocuments(filter),
    // ফিল্টার অনুযায়ী টোটাল অ্যামাউন্ট বের করা
    Purchase.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
          totalQty: { $sum: "$quantity" }
        }
      }
    ])
  ]);

  return { 
    purchases, 
    total, 
    page: Number(page), 
    totalPages: Math.ceil(total / limit),
    // এই সামারিটি ফ্রন্টএন্ডে টোটাল ক্যালকুলেশন দেখাতে সাহায্য করবে
    summary: reportSummary[0] || { totalAmount: 0, totalQty: 0 }
  };
};

// ৩. পারচেজ সামারি (সব সময়ের ড্যাশবোর্ড স্ট্যাটাস)
exports.getPurchaseSummary = async () => {
  const stats = await Purchase.aggregate([
    {
      $group: {
        _id: null,
        totalPurchasedAmount: { $sum: "$totalAmount" },
        totalQuantity: { $sum: "$quantity" },
        totalEntries: { $sum: 1 }
      }
    }
  ]);
  return stats[0] || { totalPurchasedAmount: 0, totalQuantity: 0, totalEntries: 0 };
};

// ৪. আইডি দিয়ে পারচেজ দেখা
exports.getPurchaseById = async (id) => {
  return await Purchase.findById(id)
    .populate("supplier", "name phone")
    .populate("product", "name")
    .populate("unit", "name")
    .populate("recordedBy", "name");
};