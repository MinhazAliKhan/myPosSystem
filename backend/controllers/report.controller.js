const reportService = require("../services/report.service");

exports.getDrawerReport = async (req, res, next) => {
  const userId = req.user.role === 'ADMIN' ? null : req.user.id;
  try { const data = await reportService.getDrawerReport(userId, req.query); res.json({ success: true, data }); }
  catch (err) { next(err); }
};

exports.getShiftReport = async (req, res, next) => {
  try { const data = await reportService.getShiftReport(req.query); res.json({ success: true, data }); }
  catch (err) { next(err); }
};

exports.getDailySummary = async (req, res, next) => {
  try { const data = await reportService.getDailySummaryReport(req.query); 
    res.json({ success: true, data }); }
  catch (err) { next(err); }
};
exports.getMonthlySummary = async (req, res, next) => {
  try {
    // query থেকে month এবং year নেওয়া হচ্ছে
    const { month, year } = req.query;
    const data = await reportService.getMonthlyReport(month, year);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};