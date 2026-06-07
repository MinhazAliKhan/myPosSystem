const supplierService = require("../services/supplier.service");

exports.handleCreate = async (req, res) => {
  try {
    const result = await supplierService.createSupplier(req.body, req.user.id);
    res.status(201).json({ success: true, message: "Supplier created successfully", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.handleGetAll = async (req, res) => {
  try {
    const result = await supplierService.getSuppliers(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.handleGetSingle = async (req, res) => {
  try {
    const result = await supplierService.getSupplierById(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.handleUpdate = async (req, res) => {
  try {
    const result = await supplierService.updateSupplier(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Supplier updated successfully", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.handleDelete = async (req, res) => {
  try {
    await supplierService.deleteSupplier(req.params.id);
    res.status(200).json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};