const Expense = require("../models/expense.model");
const DrawerSession = require("../models/drawerSession.model");
const mongoose = require("mongoose");

// ১. Get All Expenses
const getAllExpenses = async (query, user) => {
  const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", startDate, endDate } = query;
  const filters = {};

  if (user.role !== "ADMIN") {
    filters.createdBy = user.id;
  }

  if (startDate || endDate) {
    filters.createdAt = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setUTCHours(0, 0, 0, 0);
      filters.createdAt.$gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);
      filters.createdAt.$lte = end;
    }
  }

  const [data, total] = await Promise.all([
    Expense.find(filters)
      .populate("createdBy", "userName")
      .populate("shift")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit)),
    Expense.countDocuments(filters)
  ]);

  return { data, total, page: parseInt(page), limit: parseInt(limit), totalPage: Math.ceil(total / limit) };
};

// ২. Get Expense By ID
const getExpenseById = async (id, user) => {
  const query = { _id: id };
  if (user.role !== "ADMIN") query.createdBy = user.id;
  
  return await Expense.findById(query)
    .populate("createdBy", "userName");
};

// ৩. Create Expense (Array of Objects হ্যান্ডলিং ও ড্রয়ার আপডেট)
const createExpense = async (data, userId, userRole) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let activeDrawer = null;
    const isAdmin = userRole && userRole.toString().toUpperCase() === "ADMIN";

    // ড্রয়ার সেশন চেক (শুধু সেলসম্যানের জন্য)
    if (!isAdmin) {
      activeDrawer = await DrawerSession.findOne({ 
        user: userId, 
        status: "active" 
      }).session(session);

      if (!activeDrawer) throw new Error("No active drawer session found!");
    }

    // Array of objects থেকে মোট খরচ বের করা
    const totalAmount = data.expenses.reduce((sum, item) => sum + Number(item.amount), 0);

    // ড্রয়ার আপডেট (Expense যোগ করা)
    if (activeDrawer) {
      await DrawerSession.findByIdAndUpdate(
        activeDrawer._id,
        { 
          $inc: { drawerExpenses: Number(totalAmount) } 
        },
        { session }
      );
    }

    // এক্সপেন্স ডকুমেন্ট তৈরি
    const newExpense = await Expense.create([{ 
      expenses: data.expenses, 
      totalAmount: Number(totalAmount),
      drawerSession: activeDrawer ? activeDrawer._id : null, 
      shift: activeDrawer ? activeDrawer.shiftId : null, 
      createdBy: userId 
    }], { session });

    await session.commitTransaction();
    return newExpense[0];

  } catch (err) { 
    await session.abortTransaction(); 
    throw err; 
  } finally { 
    session.endSession(); 
  }
};

// ৪. Get Shift Total Expenses
const getShiftTotal = async (shiftId) => {
  const stats = await Expense.aggregate([
    { $match: { shift: new mongoose.Types.ObjectId(shiftId) } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);
  return stats.length > 0 ? stats[0].total : 0;
};

module.exports = { getAllExpenses, getExpenseById, createExpense, getShiftTotal };