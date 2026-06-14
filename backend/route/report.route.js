const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const { authMiddleware, allowRoles } = require("../middlewares/auth-middleware");

router.use(authMiddleware);

// Salesman/Admin ড্রয়ার রিপোর্ট
router.get("/drawer", allowRoles("SALESMAN", "ADMIN"), reportController.getDrawerReport);

// Admin শিফট রিপোর্ট
router.get("/shift", allowRoles("ADMIN"), reportController.getShiftReport);

// Admin ডেইলি সামারি রিপোর্ট
router.get("/daily-summary", allowRoles("ADMIN"), reportController.getDailySummary);
// Admin মাসিক রিপোর্ট দেখবে
router.get("/monthly-summary", allowRoles("ADMIN"), reportController.getMonthlySummary);
module.exports = router;