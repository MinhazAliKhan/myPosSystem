const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplier.controller");
const { authMiddleware, allowRoles } = require("../middlewares/auth-middleware");
const validate = require("../middlewares/validate-middleware");
const { 
  supplierSchemaZod, 
  supplierIdParamSchema, 
  getSupplierQuerySchema 
} = require("../validation/supplier.validation");

// সব সাপ্লায়ার রুটে লগইন আবশ্যক
router.use(authMiddleware);

// সাপ্লায়ার লিস্ট দেখা (ADMIN এবং SALESMAN উভয়েই পারবে)
router.get(
  "/", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(getSupplierQuerySchema, "query"), 
  supplierController.handleGetAll
);

// নির্দিষ্ট সাপ্লায়ার দেখা
router.get(
  "/:id", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(supplierIdParamSchema, "params"), 
  supplierController.handleGetSingle
);

// নতুন সাপ্লায়ার তৈরি করা (শুধুমাত্র ADMIN পারবে)
router.post(
  "/", 
  allowRoles("ADMIN"), 
  validate(supplierSchemaZod), 
  supplierController.handleCreate
);

// সাপ্লায়ার আপডেট করা
router.patch(
  "/:id", 
  allowRoles("ADMIN"), 
  validate(supplierIdParamSchema, "params"), 
  validate(supplierSchemaZod.partial()), // partial ব্যবহার করা হয়েছে যাতে সব ফিল্ড না পাঠালেও চলে
  supplierController.handleUpdate
);

// সাপ্লায়ার ডিলিট করা
router.delete(
  "/:id", 
  allowRoles("ADMIN"), 
  validate(supplierIdParamSchema, "params"), 
  supplierController.handleDelete
);

module.exports = router;