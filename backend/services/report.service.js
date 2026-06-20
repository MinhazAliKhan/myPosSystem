const DrawerSession = require("../models/drawerSession.model");
const Shift = require("../models/shift.model");
const mongoose = require("mongoose");

// ১. Salesman এর জন্য নিজের ড্রয়ার রিপোর্ট (Pagination & Sort)
exports.getDrawerReport = async (userId, query) => {
  const { page = 1, limit = 10, startDate, endDate, sortBy = "startTime", order = "desc" } = query;
  
  let match = userId ? { user: new mongoose.Types.ObjectId(userId) } : {};
  if (startDate || endDate) {
  match.startTime = {};
  if (startDate) {
    // তারিখটিকে সেই দিনের শুরুতে সেট করুন (UTC তে)
    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);
    match.startTime.$gte = start;
  }
  if (endDate) {
    // তারিখটিকে সেই দিনের শেষে সেট করুন (UTC তে)
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);
    match.startTime.$lte = end;
  }
}
  
  const sort = { [sortBy]: order === "desc" ? -1 : 1 };
  const data = await DrawerSession.find(match)
    .populate("user", "userName role")
    .sort(sort)
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit));
    
  const total = await DrawerSession.countDocuments(match);
  return { data, total, page: parseInt(page), limit: parseInt(limit) };
};

// ২. Admin এর জন্য শিফট রিপোর্ট (Date wise filtering)
exports.getShiftReport = async (query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  return await Shift.aggregate([
    { $sort: { startTime: -1 } },
    {
      $project: {
        startTime: 1,
        status: 1,
        totalSales: 1,
        totalDepositedCash: 1,
        shortOver: { $subtract: [{ $ifNull: ["$totalDepositedCash", 0] }, { $ifNull: ["$totalSales", 0] }] }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } },
        shifts: { $push: "$$ROOT" },
        dailySales: { $sum: "$totalSales" },
        dailyDeposit: { $sum: "$totalDepositedCash" },
        dailyShortOver: { $sum: "$shortOver" }
      }
    },
    { $sort: { _id: -1 } },
    { $skip: skip },
    { $limit: parseInt(limit) }
  ]);
};

// ৩. Admin এর জন্য ডেইলি সামারি
exports.getDailySummaryReport = async (query) => {
  const { date } = query;
  let match = { status: "closed" };

  if (date) {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setUTCHours(23, 59, 59, 999));
    match.endTime = { $gte: startOfDay, $lte: endOfDay };
  }

  const result = await Shift.aggregate([
    { $match: match },
    { 
      $group: { 
        _id: null,
        totalSales: { $sum: { $toDouble: { $ifNull: ["$totalSales", 0] } } },
        totalDepositedCash: { $sum: { $toDouble: { $ifNull: ["$totalDepositedCash", 0] } } },
        totalShifts: { $sum: 1 }
      } 
    },
    {
      $project: {
        _id: 0,
        totalSales: 1,
        totalDepositedCash: 1,
        totalShifts: 1,
        netRevenue: { $ifNull: ["$totalSales", 0] } // এখন নেট রেভিনিউ সরাসরি সেলস থেকে আসছে
      }
    }
  ]);

  return result.length > 0 ? result[0] : { 
    totalSales: 0, totalDepositedCash: 0, totalShifts: 0, netRevenue: 0 
  };
};
// ৪. মাসিক রিপোর্ট
exports.getMonthlyReport = async () => {
  // মাস/বছরের ফিল্টার ছাড়া শুধু সব ক্লোজড শিফট যোগ করুন
  return await Shift.aggregate([
    { 
      $match: { 
        status: "closed" // শুধু স্ট্যাটাস চেক করছে
      } 
    },
    { 
      $group: { 
        _id: null, 
        totalSales: { $sum: { $toDouble: { $ifNull: ["$totalSales", 0] } } },
        totalDepositedCash: { $sum: { $toDouble: { $ifNull: ["$totalDepositedCash", 0] } } },
        totalShifts: { $sum: 1 }
      } 
    }
  ]);
};