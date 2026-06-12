const saleService = require("../services/sale.service");

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