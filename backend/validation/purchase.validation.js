const { z } = require("zod");
const mongoose = require("mongoose");

const purchaseItemSchema = z.object({
  product: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid Product ID" }),
  quantity: z.number().positive(),
  buyingPrice: z.number().positive(),
});

const createPurchaseSchema = z.object({
  supplier: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid Supplier ID" }),
  items: z.array(purchaseItemSchema).min(1),
  note: z.string().optional(),
});

const updatePurchaseSchema = createPurchaseSchema.partial();

const purchaseIdParamSchema = z.object({ 
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid Purchase ID" }) 
});

module.exports = { createPurchaseSchema, updatePurchaseSchema, purchaseIdParamSchema };