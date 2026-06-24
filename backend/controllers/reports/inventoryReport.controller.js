const inventoryReportService = require("../../services/inventoryReport.service");

exports.getInventoryReport = async (req, res, next) => {
  try {
    // কোনো ইউজার প্যারামিটার পাঠানোর প্রয়োজন নেই
    const reportData = await inventoryReportService.getInventoryReport();
    res.status(200).json({
      success: true,
      count: reportData.length,
      data: reportData
    });
  } catch (err) {
    next(err);
  }
};