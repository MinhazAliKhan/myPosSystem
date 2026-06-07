const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchase.controller");
const { authMiddleware, allowRoles } = require("../middlewares/auth-middleware");
const validate = require("../middlewares/validate-middleware");
const { 
  bulkPurchaseSchema, 
  purchaseIdParamSchema, 
  getPurchaseQuerySchema 
} = require("../validation/purchase.validation");

// সব পারচেজ রুটে লগইন আবশ্যক
router.use(authMiddleware);

// ১. পারচেজ সামারি দেখা (ADMIN এবং SALESMAN উভয়েই পারবে)
router.get(
  "/summary", 
  allowRoles("ADMIN", "SALESMAN"), 
  purchaseController.getSummary
);

// ২. সব পারচেজ লিস্ট দেখা (Search & Pagination)
router.get(
  "/", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(getPurchaseQuerySchema, "query"), 
  purchaseController.getPurchases
);

// ৩. নির্দিষ্ট পারচেজ ডিটেইলস দেখা
router.get(
  "/:id", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(purchaseIdParamSchema, "params"), 
  purchaseController.getSinglePurchase
);

// ৪. নতুন বাল্ক পারচেজ রেকর্ড করা (শুধুমাত্র ADMIN পারবে)
router.post(
  "/", 
  allowRoles("ADMIN"), 
  validate(bulkPurchaseSchema), 
  purchaseController.createPurchase
);

module.exports = router;