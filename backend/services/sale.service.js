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
      receivedAmount: data.receivedAmount || totalAmount, 
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
    if (!sale || sale.status === "voided") {
      throw new Error("Sale not found or already voided");
    }

    // ১. স্টক আপডেট (এখানে 'item.productId' ব্যবহার করা হয়েছে)
    for (let item of sale.items) {
      await Product.findByIdAndUpdate(
        item.productId, // এখানে তোমার মডেলে 'productId' আছে, তাই এটিই দিতে হবে
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    // ২. ড্রয়ার এবং শিফট আপডেট
    const activeDrawer = await DrawerSession.findOne({ 
      user: userId, 
      status: "active" 
    }).session(session);

    if (activeDrawer) {
      await DrawerSession.findByIdAndUpdate(activeDrawer._id, {
        $inc: { drawerSales: -sale.totalAmount } 
      }, { session });

      await Shift.findByIdAndUpdate(activeDrawer.shiftId, {
        $inc: { totalSales: -sale.totalAmount }
      }, { session });
    }

    // ৩. সেলের স্ট্যাটাস আপডেট
    sale.status = "voided";
    sale.voidedBy = userId;
    sale.voidedAt = new Date();
    sale.voidReason = reason;

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

exports.getSales = async (userId, query) => {
  const { page = 1, limit = 10, search, startDate, endDate } = query;
  
  let match = {};

  if (userId) {
    match.createdBy = new mongoose.Types.ObjectId(userId);
  }
  
  // সার্চ লজিক (এটি ঠিক আছে)
  if (search) {
    match.$or = [
      { "items.name": { $regex: search, $options: "i" } },
      { $expr: { $regexMatch: { input: { $toString: "$_id" }, regex: search, options: "i" } } }
    ];
  }
  
  // ডেট ফিল্টারিং (সংশোধিত)
  if (startDate || endDate) {
    match.createdAt = {};
    
    if (startDate) {
      // স্ট্রিং থেকে সঠিক তারিখ অবজেক্ট তৈরি
      const start = new Date(startDate);
      start.setUTCHours(0, 0, 0, 0);
      match.createdAt.$gte = start;
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);
      match.createdAt.$lte = end;
    } else if (startDate) {
      // যদি শুধু startDate থাকে কিন্তু endDate না থাকে, 
      // তবে ওই নির্দিষ্ট দিনের সব ডাটা দেখানোর জন্য endDate অটো সেট করা
      const endOfDay = new Date(startDate);
      endOfDay.setUTCHours(23, 59, 59, 999);
      match.createdAt.$lte = endOfDay;
    }
  }

  // ডাটা ফেচিং
  const data = await Sale.find(match)
    .populate("createdBy", "userName")
    .populate("voidedBy", "userName")
    .sort({ createdAt: -1 })
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit));
    
  const total = await Sale.countDocuments(match);
  
  return { data, total, page: parseInt(page), limit: parseInt(limit) };
};
exports.getSaleById = async (id) => {
  // ডাটাবেজ থেকে আইডি দিয়ে খুঁজে বের করা এবং প্রয়োজনীয় তথ্য পপুলেট করা
  const sale = await Sale.findById(id)
    .populate("createdBy", "userName")         // যিনি সেল করেছেন
    .populate("voidedBy", "userName")          // যিনি ভয়েড করেছেন (যদি থাকে)
    .populate("shift", "shiftName startTime")  // শিফটের তথ্য
    .populate("drawerSession", "openingBalance"); // ড্রয়ার সেশনের তথ্য

  if (!sale) {
    throw new Error("Sale record not found");
  }

  return sale;
};
// কিচেন অর্ডারের জন্য প্রয়োজনীয় লজিক
exports.getKitchenOrders = async () => {
  const activeShift = await Shift.findOne({ status: "open" });
  if (!activeShift) throw new Error("No active shift found");

  return await Sale.find({ 
    shift: activeShift._id,
    status: "completed" 
  }).sort({ createdAt: -1 });
}