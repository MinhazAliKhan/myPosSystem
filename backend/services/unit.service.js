const Unit = require("../models/unit.model");

const getAllUnits = async (query) => {
  let { search, page = 1, limit = 10 } = query;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const filter = { isDeleted: false };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { shortName: { $regex: search, $options: "i" } }
    ];
  }

  const data = await Unit.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum);
  const total = await Unit.countDocuments(filter);
  return { data, total, page: pageNum, limit: limitNum };
};

const getUnitById = async (id) => {
  const unit = await Unit.findOne({ _id: id, isDeleted: false });
  if (!unit) throw new Error("Unit not found");
  return unit;
};

const createUnit = async (data, userId) => {
  const exists = await Unit.findOne({ 
    $or: [{ name: data.name }, { shortName: data.shortName }], 
    isDeleted: false 
  });
  if (exists) throw new Error("Unit name or short name already exists");

  const allowedFields = ["name", "shortName", "isActive"];
  const unitData = { createdBy: userId };
  allowedFields.forEach(field => {
    if (data[field] !== undefined) unitData[field] = data[field];
  });

  return await Unit.create(unitData);
};

const updateUnit = async (id, data) => {
  const unit = await Unit.findOne({ _id: id, isDeleted: false });
  if (!unit) throw new Error("Unit not found");

  const allowedFields = ["name", "shortName", "isActive"];
  allowedFields.forEach(field => {
    if (data[field] !== undefined) unit[field] = data[field];
  });

  return await unit.save();
};

const deleteUnit = async (id) => {
  const unit = await Unit.findById(id);
  if (!unit) throw new Error("Unit not found");
  unit.isDeleted = true;
  return await unit.save();
};

module.exports = { getAllUnits, getUnitById, createUnit, updateUnit, deleteUnit };