const express = require("express");
const router = express.Router();
const shiftController = require("../controllers/shift.controller");
const { authMiddleware, allowRoles } = require("../middlewares/auth-middleware");
const validate = require("../middlewares/validate-middleware");
const { closeShiftSchema } = require("../validation/shift.validation");

// সব শিফট রুটে লগইন আবশ্যক
router.use(authMiddleware);

// শিফট ওপেন করা (Admin এবং Salesman উভয়েই পারবে)
router.post("/open", allowRoles("ADMIN", "SALESMAN"), shiftController.openShift);

// শিফট ক্লোজ করা (ক্লোজ করার সময় ভ্যালিডেশন চেক হবে)
router.post(
  "/close", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(closeShiftSchema), 
  shiftController.closeShift
);

// সব শিফটের লিস্ট দেখা (অ্যাডমিন সব দেখবে, সেলসম্যান নিজেরটা)
router.get(
  "/", 
  allowRoles("ADMIN", "SALESMAN"), 
  shiftController.getShifts
);

// বর্তমানে কোনো শিফট ওপেন আছে কি না তা চেক করা
router.get(
  "/current", 
  shiftController.getCurrentShift
);

module.exports = router;