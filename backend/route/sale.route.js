const express = require("express");
const router = express.Router();
const saleController = require("../controllers/sale.controller");
const { authMiddleware, allowRoles } = require("../middlewares/auth-middleware");
const validate = require("../middlewares/validate-middleware");
const { 
  createSaleSchema, 
  saleIdParamSchema, 
  getSalesQuerySchema, 
  voidSaleSchema 
} = require("../validation/sale.validation");

// সব সেলস রুটে লগইন আবশ্যক
router.use(authMiddleware);

// নতুন সেল তৈরি করা (শুধুমাত্র SALESMAN পারবে)
router.post(
  "/createSale", 
  allowRoles("SALESMAN"), 
  validate(createSaleSchema), 
  saleController.createSale
);

// সেলের লিস্ট দেখা (ADMIN এবং SALESMAN উভয়েই পারবে)
router.get(
  "/", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(getSalesQuerySchema, "query"), 
  saleController.getSales
);

// সেল ভয়েড করা
router.patch(
  "/:id/void", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(saleIdParamSchema, "params"), 
  validate(voidSaleSchema), 
  saleController.voidSale
);

// সেল রিফান্ড করা (শুধুমাত্র ADMIN পারবে)
router.patch(
  "/:id/refund", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(saleIdParamSchema, "params"), 
  validate(voidSaleSchema), 
  saleController.refundSale
);
router.get("/top-items/:shiftId", saleController.getTopItems);

module.exports = router;