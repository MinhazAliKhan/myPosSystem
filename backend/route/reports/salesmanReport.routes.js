const express = require("express");
const router = express.Router();
// যেহেতু আমরা সব রিপোর্ট লজিক এই কন্ট্রোলারের ভেতরেই রেখেছি, তাই এটিই ইমপোর্ট হবে
const reportController = require("../../controllers/reports/salesmanReport.controller"); 
const activeDrawerMiddleware = require("../../middlewares/activeDrawerMiddleware");
const { authMiddleware, allowRoles } = require("../../middlewares/auth-middleware");

// সব রুটে লগইন আবশ্যক
router.use(authMiddleware);

// ১. সেলসম্যানের রিপোর্ট (Drawer Middleware সহ)
router.get(
  "/summary", 
  activeDrawerMiddleware, 
  allowRoles("SALESMAN"), 
  reportController.getTodaySummary
);

// ২. অ্যাডমিনের রিপোর্ট (কোনো ড্রয়ার সেশন চেক দরকার নেই)
router.get(
  "/admin-summary", 
  allowRoles("ADMIN"), 
  reportController.getAdminSummary 
);

module.exports = router;