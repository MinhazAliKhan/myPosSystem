const purchaseService = require("../services/purchase.service");

exports.getAllPurchases = async (req, res, next) => {
  try {
    const result = await purchaseService.getAllPurchases(req.query, req.user.id);
    // রেজাল্টটি সরাসরি এখানে পাঠাও
    res.status(200).json({ 
      success: true, 
      data: result.data, 
      total: result.total,
      page: result.page
    });
  } catch (err) { next(err); }
};

exports.getPurchaseById = async (req, res, next) => {
  try {
    const data = await purchaseService.getPurchaseById(req.params.id, req.user.id);
    if (!data) return next(new Error("Purchase not found"));
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

exports.createPurchase = async (req, res, next) => {
  try {
    const data = await purchaseService.createPurchase(req.body, req.user.id);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

exports.updatePurchase = async (req, res, next) => {
  try {
    const data = await purchaseService.updatePurchase(req.params.id, req.body, req.user.id);
    res.status(200).json({ success: true, message: "Purchase updated", data });
  } catch (err) { next(err); }
};

exports.deletePurchase = async (req, res, next) => {
  try {
    await purchaseService.deletePurchase(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: "Purchase deleted" });
  } catch (err) { next(err); }
};