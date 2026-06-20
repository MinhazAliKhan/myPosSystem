const express = require("express");
const router = express.Router();
const controller = require("../controllers/refund.controller"); // তোমার রিফান্ড কন্ট্রোলার
const { authMiddleware, allowRoles } = require("../middlewares/auth-middleware");
const validate = require("../middlewares/validate-middleware");
const { createRefundSchema, refundIdParamSchema } = require("../validation/refund.validation");

router.use(authMiddleware);

// Get All Refunds (ইতিহাস দেখার জন্য)
router.get("/", allowRoles("ADMIN", "MANAGER", "SALESMAN"), controller.getAllRefunds);

// Get Refund By ID (ডিটেইলস দেখার জন্য)
router.get("/:id", allowRoles("ADMIN", "MANAGER", "SALESMAN"), validate(refundIdParamSchema, "params"), controller.getRefundById);

// Create Refund (রিফান্ড এন্ট্রি দেওয়ার জন্য)
// সেলসম্যান যেহেতু রিফান্ড করবে, তাই এখানে SALESMAN রোলটিও এলাউ করা হয়েছে
router.post("/create", allowRoles("ADMIN", "MANAGER", "SALESMAN"), validate(createRefundSchema), controller.createRefund);

module.exports = router;