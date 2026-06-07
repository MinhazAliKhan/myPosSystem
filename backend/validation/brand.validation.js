const { z } = require("zod");
const mongoose = require("mongoose");

const objectId = (msg) => z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), 
{ message: msg });

const createBrandSchema = z.object({
  name: z.string().trim().min(2).max(50),
  description: z.string().trim().max(500).optional(),
  isActive: z.boolean().optional(),
});

const updateBrandSchema = createBrandSchema.partial();
const brandIdParamSchema = z.object({ id: objectId("Invalid Brand ID") });

module.exports = { createBrandSchema, updateBrandSchema, brandIdParamSchema };