const Refund = require("../models/refund.model");
const Sale = require("../models/sale.model"); // সেল ইনভয়েস চেক করার জন্য
const Product = require("../models/product.model");
const Shift = require("../models/shift.model");
const DrawerSession = require("../models/drawerSession.model");
const mongoose = require("mongoose");

// Get All Refunds with Search, Date Range & Pagination
const getAllRefunds = async (query, userId) => {
  const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", startDate, endDate } = query;
  const filters = {};

  if (startDate || endDate) {
    filters.createdAt = {};
    if (startDate) {
      // startDate এর শুরুর সময় (00:00:00)
      const start = new Date(startDate);
      start.setUTCHours(0, 0, 0, 0); // UTC ব্যবহার করা সবচেয়ে নিরাপদ
      filters.createdAt.$gte = start;
    }
    if (endDate) {
      // endDate এর শেষ সময় (23:59:59)
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);
      filters.createdAt.$lte = end;
    }
  }

  const [data, total] = await Promise.all([
    Refund.find(filters)
      .populate("salesmanId", "userName shift drawer") // আপনার চাহিদা অনুযায়ী ফিল্ডগুলো যোগ করা হয়েছে
      .populate("items.product", "name")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit)),
    Refund.countDocuments(filters)
  ]);

  return { data, total, page: parseInt(page), limit: parseInt(limit), totalPage: Math.ceil(total / limit) };
};

// Get Refund By ID
const getRefundById = async (id, userId) => {
  return await Refund.findById(id)
    .populate("salesmanId", "userName")
    .populate("items.product", "name");
};

// Create Refund
const createRefund = async (data, userId) => {
  // ১. saleId খালি থাকলে মুছে ফেলা
  if (!data.saleId || data.saleId.trim() === "") {
    delete data.saleId;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ২. ক্যালকুলেশন
    let calculatedTotal = 0;
    const processedItems = data.items.map(item => {
      const subtotal = item.quantity * item.price;
      calculatedTotal += subtotal;
      return { ...item, subtotal };
    });

    // ৩. যদি saleId থাকে, তবে সেলস রেকর্ড আপডেট করা
    if (data.saleId) {
      const sale = await Sale.findById(data.saleId).session(session);
      if (!sale) throw new Error("Invalid Sale Invoice ID");
      
      await Sale.findByIdAndUpdate(data.saleId, {
        $inc: { totalAmount: -calculatedTotal }
      }, { session });
    }

    // ৪. সক্রিয় DrawerSession আপডেট করা (Shift আপডেট করার প্রয়োজন নেই)
    const activeDrawer = await DrawerSession.findOne({ 
      user: userId, 
      status: "active" 
    }).session(session);

    if (activeDrawer) {
      // ড্রয়ার সেশনের বিক্রির হিসাব থেকে বিয়োগ
      await DrawerSession.findByIdAndUpdate(activeDrawer._id, {
        $inc: { drawerSales: -calculatedTotal } 
      }, { session });
    }

    // ৫. স্টক আপডেট (রিফান্ড পণ্য স্টকে যোগ)
    for (let item of data.items) {
      await Product.findByIdAndUpdate(
        item.productId, // এখানে তোমার মডেলে 'productId' আছে, তাই এটিই দিতে হবে
        { $inc: { stock: item.quantity } }, 
        { session }
      );
    }

    // ৬. রিফান্ড এন্ট্রি সেভ করা
    const newRefund = await Refund.create([{ 
      ...data, 
      items: processedItems, 
      totalAmount: calculatedTotal, 
      salesmanId: userId 
    }], { session });

    await session.commitTransaction();
    return newRefund[0];

  } catch (err) { 
    await session.abortTransaction(); 
    throw err; 
  } finally { 
    session.endSession(); 
  }
};
module.exports = { getAllRefunds, getRefundById, createRefund };