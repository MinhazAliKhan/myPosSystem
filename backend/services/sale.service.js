const mongoose = require("mongoose");
const Sale = require("../models/sale.model");
const Product = require("../models/product.model");
const Shift = require("../models/shift.model");
const DrawerSession = require("../models/drawerSession.model");
const Expense = require("../models/expense.model");

exports.createSale = async (data, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const shift = await Shift.findById(data.shiftId).session(session);
    if (!shift || shift.status !== "open") throw new Error("Shift is not open");
    const drawerSession = await DrawerSession.findOne({ user: userId, status: "active" }).session(session);
    if (!drawerSession) throw new Error("No active drawer session");

    let totalAmount = 0, totalCost = 0;
    const items = [];
    for (const item of data.items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product || !product.isActive) throw new Error(`Product not found`);
      if (product.stock < item.quantity) throw new Error(`Low stock: ${product.name}`);
      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;
      totalCost += product.costPrice * item.quantity;
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } }, { session });
      items.push({ ...item, name: product.name, price: product.price, costPrice: product.costPrice, unit: product.unit?.shortName || "Pcs", subtotal });
    }
   const sale = new Sale({ 
  items, 
  totalAmount, 
  totalCost, 
  // এখানে নিশ্চিত করো যে receivedAmount আসছে, না আসলে টোটাল অ্যামাউন্টই ধরবে (পুরো ক্যাশ পেমেন্ট)
  receivedAmount: data.receivedAmount || totalAmount, 
  // চেঞ্জ অ্যামাউন্ট হবে রিসিভড - টোটাল
  changeAmount: (data.receivedAmount || totalAmount) - totalAmount, 
  paymentMethod: "cash", 
  shift: shift._id, 
  drawerSession: drawerSession._id, 
  createdBy: userId 
});

await sale.save({ session });
    await DrawerSession.findByIdAndUpdate(drawerSession._id, { $inc: { drawerSales: totalAmount } }, { session });
    await session.commitTransaction();
    return sale;
  } catch (err) { await session.abortTransaction(); throw err; } finally { session.endSession(); }
};

exports.voidSale = async (saleId, userId, reason) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const sale = await Sale.findById(saleId).session(session);
    if (!sale || sale.status === "voided") throw new Error("Sale not found or already voided");
    for (const item of sale.items) { await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } }, { session }); }
    await DrawerSession.findByIdAndUpdate(sale.drawerSession, { $inc: { drawerSales: -sale.totalAmount } }, { session });
    sale.status = "voided"; sale.voidedBy = userId; sale.voidedAt = new Date(); sale.voidReason = reason;
    await sale.save({ session });
    await session.commitTransaction();
    return sale;
  } catch (err) { await session.abortTransaction(); throw err; } finally { session.endSession(); }
};

exports.refundSale = async (saleId, userId, reason) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const sale = await Sale.findById(saleId).session(session);
    if (!sale || sale.status === "refunded") throw new Error("Sale not found or already refunded");
    for (const item of sale.items) { await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } }, { session }); }
    await DrawerSession.findByIdAndUpdate(sale.drawerSession, { $inc: { drawerSales: -sale.totalAmount } }, { session });
    sale.status = "refunded"; sale.voidedBy = userId; sale.voidedAt = new Date(); sale.voidReason = reason;
    await sale.save({ session });
    await session.commitTransaction();
    return sale;
  } catch (err) { await session.abortTransaction(); throw err; } finally { session.endSession(); }
};

exports.addExpense = async (data, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const drawerSession = await DrawerSession.findOne({ user: userId, status: "active" }).session(session);
    if (!drawerSession) throw new Error("No active drawer session");
    const expense = await Expense.create([{ ...data, drawerSession: drawerSession._id, user: userId }], { session });
    await DrawerSession.findByIdAndUpdate(drawerSession._id, { $inc: { drawerExpenses: data.amount } }, { session });
    await session.commitTransaction();
    return expense[0];
  } catch (err) { await session.abortTransaction(); throw err; } finally { session.endSession(); }
};

exports.getTopSellingItems = async () => {
  return await Sale.aggregate([
    { $unwind: "$items" },
    { $group: { _id: "$items.productId", name: { $first: "$items.name" }, totalSold: { $sum: "$items.quantity" } } },
    { $sort: { totalSold: -1 } }, { $limit: 5 }
  ]);
};

// ... আগের সব ফাংশন থাকবে, শুধু এটি যোগ করুন:
exports.getSales = async (query) => {
  const { page = 1, limit = 10, search } = query;
  const filter = search ? { "items.name": { $regex: search, $options: "i" } } : {};
  return await Sale.find(filter)
    .sort({ createdAt: -1 })
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit));
};