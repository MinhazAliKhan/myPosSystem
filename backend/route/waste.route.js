const router = require("express").Router();
const controller = require("../controllers/waste.controller");
const { authMiddleware, allowRoles } = require("../middlewares/auth-middleware");
const validate = require("../middlewares/validate-middleware");
const { 
  createBulkWasteSchema, 
  getWasteQuerySchema 
} = require("../validation/waste.validation");

// সব রাউটের জন্য অথেন্টিকেশন প্রয়োজন
router.use(authMiddleware);

// সব এন্ট্রি সাবমিট করার জন্য (Bulk Entry)
// এটি ডিফল্টভাবে req.body ভ্যালিডেট করবে
router.post(
  "/bulk-entry", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(createBulkWasteSchema), 
  controller.createWaste
);

// ড্যাশবোর্ডে রিপোর্ট দেখার জন্য (Pagination & Filters)
// এখানে দ্বিতীয় প্যারামিটার "query" দেওয়া হয়েছে যাতে এটি req.query ভ্যালিডেট করে
router.get(
  "/report", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(getWasteQuerySchema, "query"), 
  controller.getWasteReport
);

module.exports = router;