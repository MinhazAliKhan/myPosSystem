const { z } = require("zod");
const mongoose = require("mongoose");

const objectId = (msg) => z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: msg });

const openShiftSchema = z.object({ 
  openingNote: z.string().optional() 
});

const drawerSessionSchema = z.object({ 
  openingCash: z.number().min(0) 
});

const closeDrawerSchema = z.object({ 
  actualCashEntered: z.number().min(0), 
  bagNumber: z.string().min(1) 
});

const closeShiftSchema = z.object({ 
  closingNote: z.string().optional() 
});

module.exports = { openShiftSchema, drawerSessionSchema, closeDrawerSchema, closeShiftSchema };