const DrawerSession = require("../models/drawerSession.model");

const activeDrawerMiddleware = async (req, res, next) => {
  try {
    const activeSession = await DrawerSession.findOne({
      user: req.user.id,
      status: "active"
    });

    if (!activeSession) {
      return res.status(400).json({
        success: false,
        message: "No active drawer session found. Please start a session to proceed."
      });
    }

    req.drawerSessionId = activeSession._id; // বানান ঠিক করা হয়েছে
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = activeDrawerMiddleware;