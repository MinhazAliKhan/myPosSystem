const { z } = require("zod");
const mongoose = require("mongoose");

const objectId = (msg) =>
  z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: msg,
  });

const closeShiftSchema = z.object({
  actualCashInDrawer: z.number().min(0),
  bagNumber: z.string().min(1, "Bag number is required"),
});

module.exports = {
  closeShiftSchema
};