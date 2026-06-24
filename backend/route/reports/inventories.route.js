const express = require("express");
const router = express.Router();
const inventoryReportController = require("../../controllers/reports/inventoryReport.controller");
const { authMiddleware, allowRoles } = require("../../middlewares/auth-middleware");

// সব রুটের জন্য লগইন চেক
router.use(authMiddleware);

// রুট: /api/v1/reports/inventories/list
router.get(
  "/list", 
  allowRoles("ADMIN", "SALESMAN"), 
  inventoryReportController.getInventoryReport
);

module.exports = router;