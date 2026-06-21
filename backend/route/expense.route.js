const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense.controller");
const { authMiddleware, allowRoles } = require("../middlewares/auth-middleware");
const validate = require("../middlewares/validate-middleware");
const { 
  createExpenseSchema, 
  expenseIdParamSchema, 
  getExpensesQuerySchema 
} = require("../validation/expense.validation");

// সব এক্সপেন্স রুটে লগইন আবশ্যক
router.use(authMiddleware);

// ১. নির্দিষ্ট শিফটের খরচ রিপোর্ট
router.get(
  "/stats/shift/:shiftId", 
  allowRoles("ADMIN", "SALESMAN"), 
  expenseController.handleGetShiftTotal
);

// ২. সব খরচের লিস্ট দেখা
router.get(
  "/", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(getExpensesQuerySchema, "query"), 
  expenseController.handleGetAll
);

// ৩. নির্দিষ্ট একটি খরচের বিস্তারিত দেখা
router.get(
  "/:id", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(expenseIdParamSchema, "params"), 
  expenseController.handleGetSingle
);

// ৪. নতুন খরচ তৈরি করা
router.post(
  "/", 
  allowRoles("ADMIN", "SALESMAN"), 
  validate(createExpenseSchema), 
  expenseController.handleCreate
);

// ৫. খরচ আপডেট করা (শুধুমাত্র ADMIN)

module.exports = router;