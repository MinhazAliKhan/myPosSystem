const Shift = require("../models/shift.model");
const Sale = require("../models/sale.model");

/**
 * ওপেন শিফট লজিক
 */
exports.openShift = async (userId) => {
  // চেক করা যে অলরেডি কোনো শিফট ওপেন আছে কিনা
  const existingShift = await Shift.findOne({ user: userId, status: "open" });
  if (existingShift) throw new Error("You already have an open shift");

  const shift = new Shift({
    user: userId,
    openingCash: 200
  });
  return await shift.save();
};

/**
 * ক্লোজ শিফট লজিক (ক্যালকুলেশন সহ)
 */
exports.closeShift = async (userId, closingData) => {
  const shift = await Shift.findOne({ user: userId, status: "open" });
  if (!shift) throw new Error("No open shift found");

  // ওই শিফটের সব সাকসেসফুল সেলস এগ্রিগেশন করা
  const salesSummary = await Sale.aggregate([
    { $match: { shift: shift._id, status: "completed" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } }
  ]);

  const totalSales = salesSummary.length > 0 ? salesSummary[0].total : 0;
  const saleCount = salesSummary.length > 0 ? salesSummary[0].count : 0;

  // ক্যালকুলেশন: সিস্টেম অনুযায়ী কত থাকা উচিত
  const expectedCash = shift.openingCash + totalSales;
  
  // ক্যালকুলেশন: শর্ট নাকি ওভার (হাতে থাকা ক্যাশ - সিস্টেম ক্যাশ)
  const difference = closingData.actualCashInDrawer - expectedCash;
  
  // ড্রয়ারে ২০০ টাকা রেখে বাকিটা ডিপোজিট অ্যামাউন্ট হিসেবে ধরা
  const depositAmount = closingData.actualCashInDrawer - 200;

  // শিফট আপডেট
  shift.status = "closed";
  shift.closedAt = new Date();
  shift.totalSales = totalSales;
  shift.saleCount = saleCount;
  shift.expectedCash = expectedCash;
  shift.actualCashInDrawer = closingData.actualCashInDrawer;
  shift.difference = difference;
  shift.depositAmount = depositAmount > 0 ? depositAmount : 0;
  shift.bagNumber = closingData.bagNumber;

  return await shift.save();
};

/**
 * শিফট লিস্ট দেখা (Pagination সহ)
 */
exports.getShifts = async (query, user) => {
  const { page = 1, limit = 10 } = query;
  
  // অ্যাডমিন সব দেখবে, সেলসম্যান শুধু নিজেরটা
  const dbQuery = user.role === "ADMIN" ? {} : { user: user.id };

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const shifts = await Shift.find(dbQuery)
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Shift.countDocuments(dbQuery);

  return {
    data: shifts,
    total: total,
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * বর্তমান অ্যাক্টিভ শিফট চেক করা
 */
exports.getCurrentShift = async (userId) => {
  return await Shift.findOne({ user: userId, status: "open" });
};