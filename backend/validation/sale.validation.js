const { z } = require("zod");
const mongoose = require("mongoose");

const objectId = (msg) => z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: msg });

const saleItemSchema = z.object({
  productId: objectId("Invalid product ID"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

const createSaleSchema = z.object({
  items: z.array(saleItemSchema).min(1, "At least one item is required"),
  receivedAmount: z.number().min(0),
  shiftId: objectId("Invalid shift ID"),
});

const saleIdParamSchema = z.object({ id: objectId("Invalid sale ID") });
const voidSaleSchema = z.object({ reason: z.string().min(3, "Reason must be at least 3 characters") });
const getSalesQuerySchema = z.object({ page: z.string().optional(), limit: z.string().optional(), search: z.string().optional() });

module.exports = { createSaleSchema, saleIdParamSchema, voidSaleSchema, getSalesQuerySchema };