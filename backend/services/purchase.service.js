const Purchase = require("../models/Purchase.model");
const Product = require("../models/Product.model");
const mongoose = require("mongoose");

const getAllPurchases = async (query, userId) => {
  const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", startDate, endDate, supplier } = query;
  const filters = { isDeleted: false };
  
  if (supplier) filters.supplier = supplier;
  if (startDate || endDate) {
    filters.createdAt = {};
    if (startDate) filters.createdAt.$gte = new Date(startDate);
    if (endDate) filters.createdAt.$lte = new Date(endDate);
  }

  const [data, total] = await Promise.all([
    Purchase.find(filters)
      .populate("supplier", "name")
      .populate("recordedBy", "name")
      .populate("items.product", "name") // সমাধান: এখানে প্রোডাক্টের নাম পপুলেট করলাম
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Purchase.countDocuments(filters)
  ]);
  
  return { data, total, page: Number(page), limit: Number(limit), totalPage: Math.ceil(total / limit) };
};

const getPurchaseById = async (id, userId) => {
  return await Purchase.findById(id)
    .populate("supplier", "name email")
    .populate("items.product", "name");
};

const createPurchase = async (data, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let calculatedTotal = 0;
    const processedItems = data.items.map(item => {
      const subtotal = item.quantity * item.buyingPrice;
      calculatedTotal += subtotal;
      return { ...item, subtotal };
    });

    for (let item of data.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } }, { session });
    }

    const newPurchase = await Purchase.create([{ ...data, items: processedItems, totalAmount: calculatedTotal, recordedBy: userId }], { session });
    await session.commitTransaction();
    return newPurchase[0];
  } catch (err) { await session.abortTransaction(); throw err; }
  finally { session.endSession(); }
};

const updatePurchase = async (id, data, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const purchase = await Purchase.findById(id).session(session);
    if (!purchase) throw new Error("Purchase not found");
    
    for (let item of purchase.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } }, { session });
    }

    let calculatedTotal = 0;
    const processedItems = data.items.map(item => {
      const subtotal = item.quantity * item.buyingPrice;
      calculatedTotal += subtotal;
      return { ...item, subtotal };
    });

    for (let item of data.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } }, { session });
    }

    Object.assign(purchase, { ...data, items: processedItems, totalAmount: calculatedTotal });
    await purchase.save({ session });
    await session.commitTransaction();
    return purchase;
  } catch (err) { await session.abortTransaction(); throw err; }
  finally { session.endSession(); }
};

const deletePurchase = async (id, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const purchase = await Purchase.findById(id).session(session);
    if (!purchase) throw new Error("Purchase not found");
    for (let item of purchase.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } }, { session });
    }
    purchase.isDeleted = true;
    await purchase.save({ session });
    await session.commitTransaction();
  } catch (err) { await session.abortTransaction(); throw err; }
  finally { session.endSession(); }
};

module.exports = { getAllPurchases, getPurchaseById, createPurchase, updatePurchase, deletePurchase };