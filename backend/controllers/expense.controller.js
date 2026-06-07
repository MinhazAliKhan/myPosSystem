const expenseService = require("../services/expense.service");

const Shift = require("../models/shift.model"); // শিফট মডেলটি ইমপোর্ট করুন

// নতুন খরচ তৈরি করা
exports.handleCreate = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    const isAdmin = req.user.role === 'ADMIN';
    let shiftId = null;

    // সেলসম্যান হলে ডাটাবেজ থেকে তার ওপেন শিফট খুঁজে বের করো
    if (!isAdmin) {
      const activeShift = await Shift.findOne({ 
        user: req.user.id, 
        status: "open" 
      });

      if (!activeShift) {
        return res.status(400).json({ 
          success: false, 
          message: "কোনো ওপেন শিফট পাওয়া যায়নি! দয়া করে শিফট ওপেন করুন।" 
        });
      }
      shiftId = activeShift._id;
    }

    // অ্যাডমিনের জন্য shiftId সবসময় null থাকবে, তাই অ্যাডমিন প্যানেলে কোনো এরর আসবে না
    const expenseData = {
      amount,
      category,
      description,
      date: date || new Date(),
      createdBy: req.user.id,
      isFromRegister: !isAdmin,
      shiftId: shiftId 
    };

    const result = await expenseService.createExpense(expenseData);
    
    res.status(201).json({ 
      success: true, 
      message: "Expense recorded successfully", 
      data: result 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// সব খরচ দেখা (ফিল্টারসহ)
exports.handleGetAll = async (req, res) => {
  try {
    const result = await expenseService.getExpenses(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// নির্দিষ্ট একটি খরচ দেখা
exports.handleGetSingle = async (req, res) => {
  try {
    const result = await expenseService.getExpenseById(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// খরচ আপডেট করা
exports.handleUpdate = async (req, res) => {
  try {
    const result = await expenseService.updateExpense(req.params.id, req.body);
    res.status(200).json({ 
      success: true, 
      message: "Expense updated successfully", 
      data: result 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// খরচ ডিলিট করা
exports.handleDelete = async (req, res) => {
  try {
    await expenseService.deleteExpense(req.params.id);
    res.status(200).json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// শিফট অনুযায়ী টোটাল খরচ
exports.handleGetShiftTotal = async (req, res) => {
  try {
    const { shiftId } = req.params;
    const total = await expenseService.getTotalExpenseByShift(shiftId);
    
    // ফ্রন্টএন্ডে এই 'totalExpense' নামটিই খুঁজছে
    res.status(200).json({ 
      success: true,
      totalExpense: total 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};