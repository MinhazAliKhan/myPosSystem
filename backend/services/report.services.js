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

// টপ প্রোডাক্ট সার্ভিস
exports.getTopProducts = async (matchCondition) => {
  return await Sale.aggregate([
    { $match: matchCondition },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        name: { $first: "$items.name" },
        totalQuantity: { $sum: "$items.quantity" },
        totalAmount: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
      }
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 5 }
  ]);
};

// ভয়েড সেলস সার্ভিস
exports.getVoidedSummary = async (matchCondition) => {
  return await Sale.aggregate([
    { $match: { ...matchCondition, status: "voided" } },
    {
      $group: {
        _id: "$voidReason",
        count: { $sum: 1 },
        totalVoidedAmount: { $sum: "$totalAmount" }
      }
    }
  ]);
};

// প্রফিট সামারি সার্ভিস
exports.getProfitSummary = async (matchCondition) => {
  return await Sale.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalCost: { $sum: "$totalCost" }
      }
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
        totalCost: 1,
        netProfit: { $subtract: ["$totalRevenue", "$totalCost"] }
      }
    }
  ]);
};

// আওয়ারলি সেলস সার্ভিস
exports.getHourlySales = async (matchCondition) => {
  return await Sale.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: { $hour: "$createdAt" },
        salesCount: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// এভারেজ বাস্কেট ভ্যালু সার্ভিস
exports.getAverageBasketValue = async (matchCondition) => {
  return await Sale.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: null,
        averageValue: { $avg: "$totalAmount" },
        totalOrders: { $sum: 1 }
      }
    }
  ]);
};