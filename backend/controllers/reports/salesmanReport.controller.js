const reportService = require("../../services/report.services");
const mongoose = require("mongoose");
const Shift = require("../../models/shift.model");

// ১. সেলসম্যানের জন্য রিপোর্ট
exports.getTodaySummary = async (req, res, next) => {
  try {
    const drawerSessionId = req.drawerSessionId;
    const salesmanId = new mongoose.Types.ObjectId(req.user.id);

    if (!drawerSessionId) {
      return res.status(400).json({ success: false, message: "No active drawer session found." });
    }

    const drawerObjectId = new mongoose.Types.ObjectId(drawerSessionId);
    
    const salesCondition = { drawerSession: drawerObjectId, status: "completed" };
    const expenseCondition = { drawerSession: drawerObjectId };

    const [sales, expenses, topProducts, voided, profit, hourly, avgBasket] = await Promise.all([
      reportService.getSalesSummary(salesCondition),
      reportService.getExpenseSummary(expenseCondition),
      reportService.getTopProducts(salesCondition),
      reportService.getVoidedSummary(salesCondition),
      reportService.getProfitSummary(salesCondition),
      reportService.getHourlySales(salesCondition),
      reportService.getAverageBasketValue(salesCondition)
    ]);

    res.status(200).json({
      success: true,
      data: {
        sales: { totalSales: sales?.totalSales || 0 },
        expenses: { totalExpenses: expenses?.totalExpenses || 0 },
        netCash: (sales?.totalSales || 0) - (expenses?.totalExpenses || 0),
        topProducts,
        voidedSummary: voided,
        profitSummary: profit[0] || { totalRevenue: 0, totalCost: 0, netProfit: 0 },
        hourlySales: hourly,
        averageBasket: avgBasket[0] || { averageValue: 0, totalOrders: 0 }
      }
    });
  } catch (err) { next(err); }
};

// ২. অ্যাডমিনের জন্য রিপোর্ট (শিফট-ভিত্তিক + সেলসম্যান পারফরম্যান্স)
exports.getAdminSummary = async (req, res, next) => {
  try {
    const activeShift = await Shift.findOne({ status: "open" }).sort({ startTime: -1 });

    if (!activeShift) {
      return res.status(404).json({ success: false, message: "No active shift found." });
    }

    const matchCondition = { shift: activeShift._id, status: "completed" };
    const expenseCondition = { shift: activeShift._id };

    const [sales, expenses, topProducts, voided, profit, hourly, avgBasket, performance] = await Promise.all([
      reportService.getSalesSummary(matchCondition),
      reportService.getExpenseSummary(expenseCondition),
      reportService.getTopProducts(matchCondition),
      reportService.getVoidedSummary(matchCondition),
      reportService.getProfitSummary(matchCondition),
      reportService.getHourlySales(matchCondition),
      reportService.getAverageBasketValue(matchCondition),
      reportService.getSalesmanPerformance(matchCondition) // নতুন পারফরম্যান্স যোগ করা হলো
    ]);

    res.status(200).json({
      success: true,
      data: { 
        sales, 
        expenses, 
        topProducts, 
        voidedSummary: voided, 
        profit: profit[0] || { totalRevenue: 0, totalCost: 0, netProfit: 0 }, 
        hourlySales: hourly, 
        avgBasket: avgBasket[0] || { averageValue: 0, totalOrders: 0 },
        salesmanPerformance: performance // পারফরম্যান্স ডেটা এখানে পাঠানো হলো
      }
    });
  } catch (err) { next(err); }
};