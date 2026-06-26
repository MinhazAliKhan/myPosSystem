const reportService = require("../services/report.service");

// Helper: যদি Admin হয় তবে null (সব ডেটা), অন্যথায় নিজ নিজ userId
const getUserId = (user) => (user.role === 'ADMIN' ? null : user.id);

exports.getDrawerReport = async (req, res, next) => {
  try {
    const userId = getUserId(req.user);
    const data = await reportService.getDrawerReport(userId, req.query);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getShiftReport = async (req, res, next) => {
  try {
    const userId = getUserId(req.user);
    const data = await reportService.getShiftReport(userId, req.query);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getDailySummary = async (req, res, next) => {
  try {
    const userId = getUserId(req.user);
    const data = await reportService.getDailySummaryReport(userId, req.query);
    // ডাটা না থাকলে কি করবেন তা এখানে কন্ট্রোল করা যায়
    if (!data || data.length === 0) {
       return res.status(200).json({ success: true, message: "No records found for this date", data: null });
    }
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getMonthlySummary = async (req, res, next) => {
  try {
    const userId = getUserId(req.user);
    const { month, year } = req.query;
    const data = await reportService.getMonthlyReport(userId, month, year);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};