const refundService = require("../services/refund.service");

// Get All Refunds (Pagination, Date range, Invoice search)
exports.getAllRefunds = async (req, res, next) => {
  try {
    // req.query থেকে date, invoiceId, page পাবো
    const result = await refundService.getAllRefunds(req.query, req.user.id);
    
    res.status(200).json({ 
      success: true, 
      data: result.data, 
      total: result.total,
      page: result.page
    });
  } catch (err) { next(err); }
};

// Get Refund By ID
exports.getRefundById = async (req, res, next) => {
  try {
    const data = await refundService.getRefundById(req.params.id, req.user.id);
    if (!data) return next(new Error("Refund record not found"));
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

// Create Refund
exports.createRefund = async (req, res, next) => {
  try {
    // রিফান্ড করার সময় কাস্টম বা সেলস ইনভয়েস এবং রিজনসহ ডাটা পাস হবে
    const data = await refundService.createRefund(req.body, req.user.id);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};