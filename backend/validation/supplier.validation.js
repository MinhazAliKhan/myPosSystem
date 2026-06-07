const { z } = require("zod");
const mongoose = require("mongoose");

const objectId = (msg) =>
  z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: msg,
  });

const supplierSchemaZod = z.object({
  name: z.string().min(2, "Name is too short").max(50).trim(),
  phone: z.string().min(11, "Invalid phone number").max(15).trim(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
});

const supplierIdParamSchema = z.object({
  id: objectId("Invalid supplier ID"),
});

const getSupplierQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional().or(z.literal("")),
  limit: z.string().regex(/^\d+$/).optional().or(z.literal("")),
  search: z.string().optional().or(z.literal("")),
});

module.exports = {
  supplierSchemaZod,
  supplierIdParamSchema,
  getSupplierQuerySchema,
};