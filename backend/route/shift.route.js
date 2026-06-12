const express = require("express");
const router = express.Router();
const { z } = require("zod");
const mongoose = require("mongoose");
const shiftController = require("../controllers/shift.controller");
const { authMiddleware, allowRoles } = require("../middlewares/auth-middleware");
const validate = require("../middlewares/validate-middleware");
const { 
  openShiftSchema, 
  drawerSessionSchema, 
  closeDrawerSchema, 
  closeShiftSchema 
} = require("../validation/shift.validation");

// জেনেরিক আইডি ভ্যালিডেশন
const idParamSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ID format",
  }),
});

router.use(authMiddleware);

// ১. কারেন্ট স্ট্যাটাস (এটা কোনো আইডি ছাড়াই কাজ করবে)
router.get(
  "/current", 
  allowRoles("ADMIN", "SALESMAN"), 
  shiftController.getCurrentStatus
);

// ২. শিফট ওপেন করা
router.post(
  "/open", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(openShiftSchema, "body"), 
  shiftController.openShift
);

// ৩. ড্রয়ার সেশন ওপেন করা
router.post(
  "/drawer/open", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(drawerSessionSchema, "body"), 
  shiftController.openDrawerSession
);

// ৪. ড্রয়ার সেশন ক্লোজ করা
router.patch(
  "/drawer/:id/close", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(idParamSchema, "params"), 
  validate(closeDrawerSchema, "body"), 
  shiftController.closeDrawerSession
);

// ৫. শিফট ক্লোজ করা
router.post(
  "/:id/close", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(idParamSchema, "params"), 
  validate(closeShiftSchema, "body"), 
  shiftController.closeShift
);

// ৬. শিফট অডিট রিপোর্ট
router.get(
  "/:id/audit", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(idParamSchema, "params"), 
  shiftController.getAuditReport
);

module.exports = router;