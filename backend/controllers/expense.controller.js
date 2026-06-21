const expenseService = require("../services/expense.service");
const Shift = require("../models/shift.model");

// ১. নতুন খরচ তৈরি করা
exports.handleCreate = async (req, res) => {
  try {
    // এখানে userRole পাস করা হচ্ছে
    const result = await expenseService.createExpense(req.body, req.user.id, req.user.role);
    
    res.status(201).json({ 
      success: true, 
      message: "Expense recorded successfully", 
      data: result 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// ২. সব খরচ দেখা (সার্ভিসের getAllExpenses এর সাথে নাম মেলানো হলো)
exports.handleGetAll = async (req, res) => {
  try {
    const result = await expenseService.getAllExpenses(req.query, req.user);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ৩. নির্দিষ্ট একটি খরচ দেখা
exports.handleGetSingle = async (req, res) => {
  try {
    const result = await expenseService.getExpenseById(req.params.id, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// ৪. শিফট অনুযায়ী টোটাল খরচ
exports.handleGetShiftTotal = async (req, res) => {
  try {
    const { shiftId } = req.params;
    const total = await expenseService.getShiftTotal(shiftId);
    
    res.status(200).json({ 
      success: true,
      totalExpense: total 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};