const unitService = require("../services/unit.service");

exports.createUnit = async (req, res, next) => {
  try {
    const data = await unitService.createUnit(req.body, req.user.id);
    res.status(201).json({ success: true, message: "Unit created successfully", data });
  } catch (err) { next(err); }
};

exports.getUnits = async (req, res, next) => {
  try {
    const result = await unitService.getAllUnits(req.query);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.getUnit = async (req, res, next) => {
  try {
    const data = await unitService.getUnitById(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.updateUnit = async (req, res, next) => {
  try {
    const data = await unitService.updateUnit(req.params.id, req.body);
    res.json({ success: true, message: "Unit updated successfully", data });
  } catch (err) { next(err); }
};

exports.deleteUnit = async (req, res, next) => {
  try {
    await unitService.deleteUnit(req.params.id);
    res.json({ success: true, message: "Unit deleted successfully" });
  } catch (err) { next(err); }
};