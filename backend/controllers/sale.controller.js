const saleService = require("../services/sale.service");
const Sale = require("../models/sale.model"); // আপনার মডেল পাথ অনুযায়ী
const Shift = require("../models/shift.model"); // শিফট মডেল

exports.createSale = async (req, res, next) => {
  try { const data = await saleService.createSale(req.body, req.user.id); res.json({ success: true, data }); } 
  catch (err) { next(err); }
};

exports.getSales = async (req, res, next) => {
  try { const data = await saleService.getSales(req.query); res.json({ success: true, data }); } 
  catch (err) { next(err); }
};

exports.voidSale = async (req, res, next) => {
  try { const data = await saleService.voidSale(req.params.id, req.user.id, req.body.reason); res.json({ success: true, data }); } 
  catch (err) { next(err); }
};

exports.refundSale = async (req, res, next) => {
  try { const data = await saleService.refundSale(req.params.id, req.user.id, req.body.reason); res.json({ success: true, data }); } 
  catch (err) { next(err); }
};

exports.addExpense = async (req, res, next) => {
  try { const data = await saleService.addExpense(req.body, req.user.id); res.json({ success: true, data }); } 
  catch (err) { next(err); }
};

exports.getTopItems = async (req, res, next) => {
  try { const data = await saleService.getTopSellingItems(); res.json({ success: true, data }); } 
  catch (err) { next(err); }
};

// নতুন কিচেন ড্যাশবোর্ড ফাংশন
exports.getKitchenOrders = async (req, res, next) => {
  try {
    const data = await saleService.getKitchenOrders();
    res.json({ success: true, data }); // এখানে ডাটা অ্যারে হিসেবে যাবে
  } catch (err) {
    next(err);
  }
};
exports.updateSaleStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const sale = await Sale.findByIdAndUpdate(
      req.params.id, 
      { status: status }, 
      { new: true }
    );
    res.json({ success: true, data: sale });
  } catch (err) {
    next(err);
  }
};