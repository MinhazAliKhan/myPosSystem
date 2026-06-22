const Sale = require("../models/sale.model");
const Expense = require("../models/expense.model");

// সেলস সামারি সার্ভিস
exports.getSalesSummary = async (matchCondition) => {
  const result = await Sale.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
        transactionCount: { $sum: 1 }
      }
    }
  ]);
  return result[0] || { totalSales: 0, transactionCount: 0 };
};

// এক্সপেন্স সামারি সার্ভিস
exports.getExpenseSummary = async (matchCondition) => {
  const result = await Expense.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: "$totalAmount" },
        expenseCount: { $sum: 1 }
      }
    }
  ]);
  return result[0] || { totalExpenses: 0, expenseCount: 0 };
};