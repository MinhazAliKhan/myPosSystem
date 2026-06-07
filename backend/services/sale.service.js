const mongoose = require("mongoose");
const Sale = require("../models/sale.model");
const Product = require("../models/product.model");
const Shift = require("../models/shift.model");

// CREATE SALE
exports.createSale = async (data, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const shift = await Shift.findById(data.shiftId).session(session);
    if (!shift || shift.status !== "open") throw new Error("Shift is not open");

    const items = [];
    let totalAmount = 0;
    let totalCost = 0;

    for (const item of data.items) {
      const product = await Product.findById(item.productId).populate("unit").session(session);

      if (!product || !product.isActive) throw new Error(`Product ${item.productId} not found`);
      if (product.stock < item.quantity) throw new Error(`Low stock for ${product.name}`);

      const subtotal = product.price * item.quantity;
      const itemTotalCost = product.costPrice * item.quantity;

      totalAmount += subtotal;
      totalCost += itemTotalCost;

      // Stock Update
      product.stock -= item.quantity;
      await product.save({ session });

      items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        costPrice: product.costPrice, // Snapshot
        unit: product.unit?.shortName || "Pcs", 
        quantity: item.quantity,
        subtotal
      });
    }

    if (data.receivedAmount < totalAmount) throw new Error("Insufficient received amount");

    const sale = new Sale({
      items,
      totalAmount,
      totalCost,
      receivedAmount: data.receivedAmount,
      changeAmount: data.receivedAmount - totalAmount,
      shift: shift._id,
      createdBy: userId,
    });

    await sale.save({ session });
    await session.commitTransaction();
    return sale;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

// GET SALES
exports.getSales = async (query, user) => {
  const { page = 1, limit = 10, startDate, shiftId } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  let dbQuery = user.role === "ADMIN" ? {} : { createdBy: user.id };

  if (shiftId) dbQuery.shift = shiftId;

  // Single Date Filter Logic
  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(startDate);
    end.setHours(23, 59, 59, 999);
    dbQuery.createdAt = { $gte: start, $lte: end };
  }

  const sales = await Sale.find(dbQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate("createdBy", "name");

  const total = await Sale.countDocuments(dbQuery);
  return { sales, total };
};

// VOID SALE
exports.voidSale = async (saleId, userId, reason) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sale = await Sale.findById(saleId).session(session);
    if (!sale) throw new Error("Sale not found");
    if (sale.status === "voided") throw new Error("Sale already voided");

    // Restocking
    for (const item of sale.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    sale.status = "voided";
    sale.voidedBy = userId;
    sale.voidedAt = new Date();
    sale.voidReason = reason || "Voided by user";

    await sale.save({ session });
    await session.commitTransaction();
    return sale;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

// REFUND SALE
exports.refundSale = async (saleId, userId, reason) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sale = await Sale.findById(saleId).session(session);
    if (!sale) throw new Error("Sale not found");
    if (sale.status !== "completed") throw new Error("Only completed sales can be refunded");

    for (const item of sale.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    sale.status = "refunded";
    sale.voidedBy = userId; 
    sale.voidedAt = new Date();
    sale.voidReason = reason || "Customer Refund";

    await sale.save({ session });
    await session.commitTransaction();
    return sale;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};
// GET TOP 5 ITEMS FOR A SHIFT
exports.getTopSellingItems = async () => {
  try {
    // গত ১৫ দিনের ডেট ক্যালকুলেশন
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    return await Sale.aggregate([
      { 
        $match: { 
          createdAt: { $gte: fifteenDaysAgo }, 
          status: { $ne: "voided" } 
        } 
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          productName: { $first: "$items.name" },
          totalQty: { $sum: "$items.quantity" },
          totalAmount: { $sum: "$items.subtotal" }
        }
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 }
    ]);
  } catch (error) {
    console.error("Aggregation Error:", error);
    return [];
  }
};