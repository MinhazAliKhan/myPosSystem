const wasteService = require("../services/waste.service");

exports.createWaste = async (req, res, next) => {
  try {
    // req.user.id আসছে auth middleware থেকে
    const data = await wasteService.recordBulkWaste(req.body, req.user.id);
    res.status(201).json({ success: true, message: "Waste recorded and stock updated", data });
  } catch (err) { next(err); }
};

exports.getWasteReport = async (req, res, next) => {
  try {
    const result = await wasteService.getWasteList(req.query);
    res.json({ 
      success: true, 
      data: result.wasteData,      // মেইন লিস্ট
      totalEntries: result.totalEntries, 
      totalPages: result.totalPages,
      currentPage: result.currentPage
    });
  } catch (err) { next(err); }
};