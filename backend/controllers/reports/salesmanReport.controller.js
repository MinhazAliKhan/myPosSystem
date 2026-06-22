const reportService = require("../../services/report.services");
const mongoose = require("mongoose");

exports.getTodaySummary = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const drawerSessionId = req.drawerSessionId;
    const salesmanId = new mongoose.Types.ObjectId(req.user.id);

    // ১. চেক করো ড্রয়ার সেশন আছে কি না
    if (!drawerSessionId) {
      return res.status(400).json({
        success: false,
        message: "No active drawer session found. Please open a drawer first."
      });
    }

    const drawerObjectId = new mongoose.Types.ObjectId(drawerSessionId);

    const salesCondition = {
      createdBy: salesmanId,
      drawerSession: drawerObjectId,
      status: "completed"
    };

    const expenseCondition = {
      createdBy: salesmanId,
      drawerSession: drawerObjectId
    };

    // ডিবাগিং লগ (টার্মিনালে চেক করো)
    console.log("Fetching report for Drawer:", drawerObjectId);

    // ডাটা ফেচিং
    const [sales, expenses] = await Promise.all([
      reportService.getSalesSummary(salesCondition),
      reportService.getExpenseSummary(expenseCondition)
    ]);

    // ডিবাগিং লগ (ডাটা আসছে কি না চেক করো)
    console.log("Sales Data:", sales);
    console.log("Expense Data:", expenses);

    // ডাটা জিরো চেক
    const totalSales = sales?.totalSales || 0;
    const totalExpenses = expenses?.totalExpenses || 0;

    res.status(200).json({
      success: true,
      data: {
        sales: { totalSales },
        expenses: { totalExpenses },
        netCash: totalSales - totalExpenses
      }
    });
  } catch (err) {
    console.error("Backend Error Details:", err);
    next(err);
  }
};