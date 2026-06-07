const { z } = require("zod");

// ObjectId ভ্যালিডেশন এর জন্য একটি কমন ফাংশন
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

// ১. প্রতিটি আইটেমের স্কিমা
const purchaseItemSchema = z.object({
  product: objectIdSchema,
  quantity: z.number().positive("Quantity must be greater than 0"),
  unit: objectIdSchema,
  buyingPrice: z.number().nonnegative("Buying price cannot be negative"),
  note: z.string().optional(),
});

// ২. মেইন বাল্ক পারচেজ (Request Body)
exports.bulkPurchaseSchema = z.object({
  supplier: objectIdSchema,
  status: z.enum(["Pending", "Received", "Returned"], {
    required_error: "Status is required",
  }),
  items: z
    .array(purchaseItemSchema)
    .nonempty("At least one item is required in the purchase list"),
});

// ৩. আইডি প্যারামিটার (Request Params)
exports.purchaseIdParamSchema = z.object({
  id: objectIdSchema,
});

// ৪. কোয়েরি ভ্যালিডেশন (Request Query)
exports.getPurchaseQuerySchema = z.object({
  supplier: z.string().optional(),
  status: z.enum(["Pending", "Received", "Returned"]).optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});