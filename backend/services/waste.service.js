const mongoose = require("mongoose");
const Waste = require("../models/waste.model");
const Product = require("../models/product.model");

exports.recordBulkWaste = async (data, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const wasteEntries = [];

    for (const item of data.items) {
      // ১. প্রোডাক্ট চেক
      const product = await Product.findOne({ _id: item.product, isDeleted: false }).session(session);
      
      if (!product) throw new Error(`Product not found: ${item.product}`);
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Current: ${product.stock}`);
      }

      // ২. কস্ট প্রাইস স্ন্যাপশট
      const currentCost = Number(product.costPrice || 0);
      const rowTotal = Number(item.quantity) * currentCost;

      // ৩. অ্যারেতে পুশ করা
      wasteEntries.push({
        product: item.product,
        quantity: item.quantity,
        unit: item.unit, 
        reason: item.reason,
        note: item.note || "",
        costPriceAtTime: currentCost,
        totalLossValue: rowTotal,
        recordedBy: userId
      });

      // ৪. স্টক কমানো
      product.stock -= item.quantity;
      product.updatedBy = userId;
      await product.save({ session });
    }

    // ৫. বাল্ক ইনসার্ট
    const results = await Waste.insertMany(wasteEntries, { session });

    await session.commitTransaction();
    return results;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

exports.getWasteList = async (query) => {
  const { date, productId, page = 1, limit = 10 } = query;
  const filter = {};

  // তারিখ ফিল্টার
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.createdAt = { $gte: start, $lte: end };
  }

  // নির্দিষ্ট প্রোডাক্ট ফিল্টার
  if (productId) {
    filter.product = productId;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const wasteData = await Waste.find(filter)
    .populate("product", "name sku")
    .populate("unit", "name") // ইউনিট পপুলেট যোগ করা হয়েছে
    .populate("recordedBy", "userName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalEntries = await Waste.countDocuments(filter);

  return {
    wasteData,
    totalEntries,
    totalPages: Math.ceil(totalEntries / parseInt(limit)),
    currentPage: parseInt(page)
  };
};