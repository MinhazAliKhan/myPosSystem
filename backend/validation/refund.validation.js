const { z } = require("zod");
const mongoose = require("mongoose");

// রিফান্ডে থাকা প্রতিটি আইটেমের ভ্যালিডেশন
const refundItemSchema = z.object({
  product: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { 
    message: "Invalid Product ID" 
  }),
  // নাম এবং সাবটোটাল ব্যাকএন্ড থেকে আসবে, তাই অপশনাল
  name: z.string().optional(),
  quantity: z.number().positive({ message: "Quantity must be a positive number" }),
  price: z.number().positive({ message: "Price must be a positive number" }),
  subtotal: z.number().optional(),
});

// রিফান্ড ক্রিয়েট করার ভ্যালিডেশন
const createRefundSchema = z.object({
  // saleId অপশনাল এবং যদি পাঠায় তবে সেটি যেন ভ্যালিড ObjectId হয়
  saleId: z.string().refine((val) => !val || mongoose.Types.ObjectId.isValid(val), { 
    message: "Invalid Sale ID" 
  }).optional().or(z.literal("")),
  
  items: z.array(refundItemSchema).min(1, { message: "At least one item is required" }),
  reason: z.string().min(5, { message: "Please provide a valid reason (min 5 chars)" }),
});

// আইডি প্যারাম ভ্যালিডেশন
const refundIdParamSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { 
    message: "Invalid Refund ID" 
  })
});

module.exports = { 
  createRefundSchema, 
  refundIdParamSchema 
};