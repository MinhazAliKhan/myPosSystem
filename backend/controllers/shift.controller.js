const Shift = require("../models/shift.model");
const DrawerSession = require("../models/drawerSession.model");
const shiftService = require("../services/shift.service");

exports.openShift = async (req, res, next) => {
  try { 
    const result = await shiftService.createNewShift(req.body, req.user.id); 
    res.status(201).json({ success: true, data: result }); 
  } catch (error) { next(error); }
};

exports.openDrawerSession = async (req, res, next) => {
  try { 
    const result = await shiftService.startDrawerSession(req.body, req.user.id); 
    res.status(201).json({ success: true, data: result }); 
  } catch (error) { next(error); }
};

exports.closeDrawerSession = async (req, res, next) => {
  try { 
    const result = await shiftService.finalizeDrawerSession(req.params.id, req.body); 
    res.status(200).json({ success: true, data: result }); 
  } catch (error) { next(error); }
};

exports.closeShift = async (req, res, next) => {
  try { 
    const result = await shiftService.finalizeShift(req.params.id, req.body); 
    res.status(200).json({ success: true, data: result }); 
  } catch (error) { next(error); }
};

exports.getAuditReport = async (req, res, next) => {
  try { 
    const result = await shiftService.getShiftAudit(req.params.id); 
    res.status(200).json({ success: true, data: result }); 
  } catch (error) { next(error); }
};

exports.getCurrentStatus = async (req, res, next) => {
  try {
    const shift = await Shift.findOne({ status: "open" });
    
    if (!shift) {
      return res.status(200).json({ success: true, data: { shift: null, drawers: [] } });
    }
    
    const drawers = await DrawerSession.find({ shiftId: shift._id, status: "active" });
    
    res.status(200).json({ success: true, data: { shift, drawers } });
  } catch (error) {
    next(error);
  }
};