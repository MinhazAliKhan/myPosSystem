const express = require("express");
const router = express.Router();
const salesmanReportController = require("../../controllers/reports/salesmanReport.controller");
const activeDrawerMiddleware = require("../../middlewares/activeDrawerMiddleware"); // ফাইল নেম ফিক্সড
const { authMiddleware, allowRoles } = require("../../middlewares/auth-middleware");

// সব রুটে লগইন আবশ্যক
router.use(authMiddleware);

// সিকোয়েন্স ঠিক করা হয়েছে: auth -> activeDrawer -> roleCheck -> controller
router.get(
  "/summary", 
  activeDrawerMiddleware, 
  allowRoles("SALESMAN"), 
  salesmanReportController.getTodaySummary
);

module.exports = router;