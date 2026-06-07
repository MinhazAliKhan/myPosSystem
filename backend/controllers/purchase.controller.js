const purchaseService = require("../services/purchase.service");

exports.createPurchase = async (req, res) => {
  try {
    const result = await purchaseService.receiveBulkPurchase(req.body, req.user.id);
    res.status(201).json({ success: true, message: "Purchase recorded successfully", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getPurchases = async (req, res) => {
  try {
    const result = await purchaseService.getAllPurchases(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const result = await purchaseService.getPurchaseSummary();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ৪. নির্দিষ্ট একটি পারচেজ আইডি দিয়ে দেখা
exports.getSinglePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await purchaseService.getPurchaseById(id);
    
    if (!result) {
      return res.status(404).json({ success: false, message: "Purchase record not found" });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};