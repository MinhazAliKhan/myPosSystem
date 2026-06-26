const mongoose = require("mongoose");
const Shift = require("../models/shift.model"); 
const DrawerSession = require("../models/drawerSession.model");

exports.createNewShift = async (data, userId) => {
  const activeShift = await Shift.findOne({ status: "open" });
  if (activeShift) throw new Error("A shift is already active.");
  return await Shift.create({ ...data, openedBy: userId });
};

exports.startDrawerSession = async (data, userId) => {
  const activeShift = await Shift.findOne({ status: "open" });
  if (!activeShift) throw new Error("No active shift found.");
  const existing = await DrawerSession.findOne({ user: userId, status: "active" });
  if (existing) throw new Error("You already have an active drawer!");
  return await DrawerSession.create({ 
    shiftId: activeShift._id, 
    user: userId, 
    openingCash: data.openingCash || 200 
  });
};

exports.finalizeDrawerSession = async (sessionId, data) => {
  const session = await DrawerSession.findById(sessionId);
  if (!session) throw new Error("Session not found");
  if (session.status === "cashed-out") throw new Error("Drawer already cashed out");
  
  const opening = Number(session.openingCash) || 0;
  const sales = Number(session.drawerSales) || 0;
  const expenses = Number(session.drawerExpenses) || 0;
  
  const expected = opening + sales - expenses;
  
  session.actualCashEntered = Number(data.actualCashEntered) || 0;
  session.bagNumber = data.bagNumber;
  session.shortOver = session.actualCashEntered - expected;
  session.status = "cashed-out";
  session.endTime = new Date();
  
  return await session.save();
};

exports.finalizeShift = async (shiftId, data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const activeDrawers = await DrawerSession.find({ shiftId, status: "active" }).session(session);
    if (activeDrawers.length > 0) throw new Error("Cannot close shift! Some drawers are still active.");

    const summary = await DrawerSession.aggregate([
      { $match: { shiftId: new mongoose.Types.ObjectId(shiftId) } },
      { $group: { 
          _id: null, 
          totalOpening: { $sum: { $ifNull: ["$openingCash", 0] } },
          sales: { $sum: { $ifNull: ["$drawerSales", 0] } },
          tax: { $sum: { $ifNull: ["$drawerTax", 0] } },
          exp: { $sum: { $ifNull: ["$drawerExpenses", 0] } },
          depo: { $sum: { $ifNull: ["$actualCashEntered", 0] } } 
      }}
    ]).session(session);

    const s = summary[0] || { totalOpening: 0, sales: 0, tax: 0, exp: 0, depo: 0 };

    const shift = await Shift.findByIdAndUpdate(shiftId, {
      status: "closed",
      totalSales: s.sales,
      totalTax: s.tax,
      totalExpenses: s.exp,
      totalDepositedCash: s.depo, 
      closingNote: data.closingNote,
      endTime: new Date()
    }, { new: true, session });

    await session.commitTransaction();
    return shift;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

exports.getShiftAudit = async (shiftId) => {
  const shift = await Shift.findById(shiftId).populate("openedBy", "name");
  const drawers = await DrawerSession.find({ shiftId }).populate("user", "name");
  return { shift, drawers };
};