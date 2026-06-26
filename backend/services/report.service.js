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

// ২. শিফট রিপোর্ট (Admin সবার জন্য, Salesman শুধু তার নিজের শিফটের জন্য)
exports.getShiftReport = async (userId, query) => {
  const { page = 1, limit = 10, startDate, endDate } = query;
  
  // ১. ইউজার বা অ্যাডমিন অনুযায়ী ফিল্টার তৈরি
  let match = userId ? { openedBy: new mongoose.Types.ObjectId(userId) } : {};
  
  // ২. তারিখ অনুযায়ী ফিল্টারিং
  if (startDate || endDate) {
    match.startTime = {};
    if (startDate) {
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
        match.startTime.$gte = start;
    }
    if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        match.startTime.$lte = end;
    }
  }

  // ৩. ডাটাবেস থেকে ডাটা আনা (Pagination ও Sort সহ)
  const data = await Shift.find(match)
    .populate("openedBy", "userName role")
    .sort({ startTime: -1 })
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit));

  // ৪. টোটাল শিফটের সংখ্যা (Pagination এর জন্য)
  const total = await Shift.countDocuments(match);
  
  return { 
    data, 
    total, 
    page: parseInt(page), 
    limit: parseInt(limit) 
  };
};

// ৩. ডেইলি সামারি রিপোর্ট (এগ্রিগেশন ব্যবহার করে)
exports.getDailySummaryReport = async (userId, query) => {
  const { date } = query;
  // date string কে Date অবজেক্টে রূপান্তর
  const targetDate = date ? new Date(date) : new Date();

  // দিন অনুযায়ী রেঞ্জ সেট করা (UTC)
  const startOfDay = new Date(targetDate);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  let match = {
    startTime: { $gte: startOfDay, $lte: endOfDay }
  };
  
  if (userId) {
    match.openedBy = new mongoose.Types.ObjectId(userId);
  }

  // ডাটাবেস থেকে লিস্ট আনা
  const data = await Shift.find(match)
    .populate("openedBy", "userName role")
    .sort({ startTime: -1 });

  return data; // এটি একটি Array রিটার্ন করবে
};

// ৪. মাসিক রিপোর্ট (নির্দিষ্ট মাস এবং বছর অনুযায়ী)
exports.getMonthlyReport = async (userId, month, year) => {
  // মাস (1-12) এবং বছর (যেমন: 2026) ইনপুট হিসেবে ধরছি
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  let match = {
    startTime: { $gte: startDate, $lte: endDate }
  };
  if (userId) match.openedBy = new mongoose.Types.ObjectId(userId);

  const data = await Shift.aggregate([
    { $match: match },
    { $project: {
        day: { $dayOfMonth: "$startTime" },
        totalSales: 1,
        totalExpenses: 1,
        totalShortOver: 1
    }},
    { $group: {
        _id: "$day",
        dailySales: { $sum: "$totalSales" },
        dailyExpenses: { $sum: "$totalExpenses" },
        dailyShortOver: { $sum: "$totalShortOver" }
    }},
    { $sort: { _id: 1 } }
  ]);

  return data;
};