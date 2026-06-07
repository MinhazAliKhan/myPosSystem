const shiftService = require("../services/shift.service");


exports.openShift = async (req, res, next) => {
  try {
    const data = await shiftService.openShift(req.user.id);
    res.json({ success: true, message: "Shift opened with 200 cash", data });
  } catch (err) { next(err); }
};

exports.closeShift = async (req, res, next) => {
  try {
    const data = await shiftService.closeShift(req.user.id, req.body);
    res.json({ success: true, message: "Shift closed successfully", data });
  } catch (err) { next(err); }
};

exports.getShifts = async (req, res, next) => {
  try {
    const result = await shiftService.getShifts(req.query, req.user);
    
    // Result object-er bhetor theke data ebong total-ke ber kore direct pathachchi
    res.json({ 
      success: true, 
      data: result.data,   // Shifts array
      total: result.total  // Total count
    });
  } catch (err) { 
    next(err); 
  }
};
// 2. GET CURRENT SHIFT: For frontend to check active status
exports.getCurrentShift = async (req, res, next) => {
  try {
    const data = await shiftService.getCurrentShift(req.user.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
