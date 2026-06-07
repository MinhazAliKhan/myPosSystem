const { z } = require("zod");
const mongoose = require("mongoose");

// ObjectId ভ্যালিডেশন ফাংশন
const objectId = (msg) =>
  z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: msg,
  });

// খরচ তৈরির জন্য ভ্যালিডেশন স্কিমা
const createExpenseSchema = z.object({
  amount: z.number().min(0, "Amount must be at least 0"),
  category: z.enum(['Tea/Snacks', 'Transport', 'Cleaning', 'Utilities', 'Others'], {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  description: z.string().max(200, "Description cannot exceed 200 characters").optional(),
  // এখানে .optional() যোগ করা হলো যাতে অ্যাডমিন শিফট ছাড়াও এন্ট্রি দিতে পারে
  shiftId: objectId("Invalid shift ID").optional(),
});

// আইডি দিয়ে কোনো নির্দিষ্ট খরচ খোঁজার জন্য
const expenseIdParamSchema = z.object({
  id: objectId("Invalid expense ID"),
});

// আরও নিখুঁত কুয়েরি ভ্যালিডেশন
const getExpensesQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  // এখানেও আমরা Enum চেক দিয়ে দিচ্ছি যাতে ভুল ক্যাটাগরিতে সার্চ না হয়
  category: z.enum(['Tea/Snacks', 'Transport', 'Cleaning', 'Utilities', 'Others']).optional(),
  // শিফট আইডি কুয়েরি করার সময়ও সেটা ভ্যালিড ObjectId কি না চেক করবে
  shiftId: z.string().refine((val) => !val || mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid shift ID format",
  }).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

module.exports = {
  createExpenseSchema,
  expenseIdParamSchema,
  getExpensesQuerySchema,
};