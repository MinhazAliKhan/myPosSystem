const { z } = require("zod");
const mongoose = require("mongoose");

const createUnitSchema = z.object({
  name: z.string().trim().min(2),
  shortName: z.string().trim().min(1),
  isActive: z.boolean().optional(),
});

const updateUnitSchema = createUnitSchema.partial();
const unitIdParamSchema = z.object({ id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)) });

module.exports = { createUnitSchema, updateUnitSchema, unitIdParamSchema };