const saleService = require("../services/sale.service");

exports.createSale = async (req, res, next) => {
  try {
    const data = await saleService.createSale(req.body, req.user.id);
    res.json({ success: true, message: "Sale completed", data });
  } catch (err) { next(err); }
};

exports.getSales = async (req, res, next) => {
  try {
    const result = await saleService.getSales(req.query, req.user);
    // সরাসরি data এবং total পাঠিয়ে দিচ্ছি যাতে ফ্রন্টএন্ডে সুবিধা হয়
    res.json({ 
      success: true, 
      data: result.sales, 
      total: result.total 
    });
  } catch (err) { 
    next(err); 
  }
};

exports.voidSale = async (req, res, next) => {
  try {
    const data = await saleService.voidSale(req.params.id, req.user.id, req.body.reason);
    res.json({ success: true, message: "Sale voided", data });
  } catch (err) { next(err); }
};

exports.refundSale = async (req, res, next) => {
  try {
    const data = await saleService.refundSale(req.params.id, req.user.id, req.body.reason);
    res.json({ success: true, message: "Sale refunded", data });
  } catch (err) { next(err); }
};
exports.getTopItems = async (req, res) => {
  try {
    const data = await saleService.getTopSellingItems();
    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};