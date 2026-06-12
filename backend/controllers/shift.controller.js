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
    const Shift = require("../models/shift.model");
    const DrawerSession = require("../models/drawerSession.model");
    
    // ১. বর্তমানে ওপেন আছে এমন শিফট খুঁজুন
    const shift = await Shift.findOne({ status: "open" });
    
    // ২. শিফট না থাকলে খালি ডাটা পাঠান
    if (!shift) {
      return res.status(200).json({ success: true, data: { shift: null, drawers: [] } });
    }
    
    // ৩. ঐ শিফটের আন্ডারে একটিভ ড্রয়ার খুঁজুন
    const drawers = await DrawerSession.find({ shiftId: shift._id, status: "active" });
    
    res.status(200).json({ success: true, data: { shift, drawers } });
  } catch (error) {
    next(error);
  }
};