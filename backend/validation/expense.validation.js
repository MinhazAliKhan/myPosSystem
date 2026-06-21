const { z } = require("zod");
const mongoose = require("mongoose");

// ObjectId ভ্যালিডেশন
const objectId = (msg) =>
  z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: msg,
  });

// খরচ তৈরির জন্য ভ্যালিডেশন স্কিমা (যেহেতু মডেলে expenses একটি Array)
const createExpenseSchema = z.object({
  expenses: z.array(
    z.object({
      category: z.enum(['Tea/Snacks', 'Transport', 'Cleaning', 'Utilities', 'Others'], {
        errorMap: () => ({ message: "Please select a valid category" }),
      }),
      amount: z.number().positive("Amount must be greater than 0"),
      note: z.string().max(200, "Note cannot exceed 200 characters").optional(),
    })
  ).min(1, "At least one expense item is required"),
});

// আইডি দিয়ে খোঁজার জন্য
const expenseIdParamSchema = z.object({
  id: objectId("Invalid expense ID"),
});

// কুয়েরি ভ্যালিডেশন
const getExpensesQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  category: z.enum(['Tea/Snacks', 'Transport', 'Cleaning', 'Utilities', 'Others']).optional(),
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