const Expense = require("../models/expense.model");
const mongoose = require("mongoose");

// এই ফাংশনটি এখন কন্ট্রোলার থেকে পাঠানো অবজেক্টটি সরাসরি সেভ করবে
exports.createExpense = async (expenseData) => {
  const newExpense = new Expense(expenseData);
  return await newExpense.save();
};

exports.getExpenses = async (query) => {
  const { page = 1, limit = 10, search, startDate, endDate } = query;
  const filters = {};
  
  if (search) {
    filters.$or = [
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  if (startDate || endDate) {
    filters.date = {};
    if (startDate) filters.date.$gte = new Date(new Date(startDate).setUTCHours(0,0,0,0));
    if (endDate) filters.date.$lte = new Date(new Date(endDate).setUTCHours(23,59,59,999));
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [expenses, total] = await Promise.all([
    Expense.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("createdBy", "userName email")
      .lean(),
    Expense.countDocuments(filters),
  ]);

  return {
    expenses,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
  };
};

exports.getExpenseById = async (id) => {
  const expense = await Expense.findById(id).populate("createdBy", "userName email");
  if (!expense) throw new Error("Expense not found");
  return expense;
};

exports.updateExpense = async (id, updateData) => {
  return await Expense.findByIdAndUpdate(id, { $set: updateData }, { new: true });
};

exports.deleteExpense = async (id) => {
  return await Expense.findByIdAndDelete(id);
};

exports.getTotalExpenseByShift = async (shiftId) => {
  if (!shiftId) return 0;
  
  // কনসোলে চেক করার জন্য এই লাইনটি দিন
  console.log("Fetching expense for shift:", shiftId);

  const stats = await Expense.aggregate([
    { 
      $match: { 
        shiftId: new mongoose.Types.ObjectId(shiftId) 
      } 
    },
    { 
      $group: { 
        _id: null, 
        totalAmount: { $sum: "$amount" } // এখানে totalAmount ই থাক
      } 
    },
  ]);

  const total = stats.length > 0 ? stats[0].totalAmount : 0;
  console.log("Total Expense found in DB:", total); // চেক করার জন্য
  return total;
};