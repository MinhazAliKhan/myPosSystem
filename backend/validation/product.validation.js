const { z } = require('zod');
const mongoose = require('mongoose');

const objectId = (msg) => z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: msg
});

const createProductSchema = z.object({
    name: z.string().trim().min(2, "Name is too short"),
    // SKU যদি অপশনাল হয় তবে সেটি খালি স্ট্রিং হওয়া উচিত নয়
    sku: z.string().trim().min(1, "SKU cannot be empty").optional(), 
    price: z.number().min(0, "Price must be positive"), 
    costPrice: z.number().min(0).default(0),
    unit: objectId("Invalid Unit ID"), 
    category: objectId("Invalid Category ID"), 
    brand: objectId("Invalid Brand ID"), 
    stock: z.number().min(0).default(0), 
    lowStockLevel: z.number().min(0).default(5), 
    isActive: z.boolean().optional(), // বানান ঠিক করা হয়েছে (isActive)
});

// Partial ব্যবহার করার সময় objectId গুলোর মেসেজ ঠিক রাখার জন্য এটি সেরা উপায়
const updateProductSchema = createProductSchema.partial(); 

const productIdParamSchema = z.object({
    id: objectId("Invalid product ID")
});

module.exports = { 
    createProductSchema,
    updateProductSchema,
    productIdParamSchema
};