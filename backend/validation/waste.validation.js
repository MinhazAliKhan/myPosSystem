const { z } = require('zod');
const mongoose = require('mongoose');

// ObjectId চেক করার জন্য হেল্পার ফাংশন
const objectId = (msg) => z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: msg
});

/**
 * ১. Waste Create করার জন্য স্কিমা (বডির জন্য)
 * এটি একটি Array ভ্যালিডেট করবে কারণ আপনি Bulk এন্ট্রি চাচ্ছেন
 */
const wasteItemSchema = z.object({
    product: objectId("Invalid Product ID"),
    quantity: z.number().positive("Quantity must be positive"),
    unit: objectId("Invalid Unit ID"), // Unit টেবিলের রেফারেন্স
    reason: z.enum(["Expired", "Damaged", "Lost", "Theft", "Other"], {
        errorMap: () => ({ message: "Reason must be Expired, Damaged, Lost, Theft, or Other" })
    }),
    note: z.string().trim().optional().or(z.literal(''))
});

// মেইন বাল্ক ক্রিয়েট স্কিমা
const createBulkWasteSchema = z.object({
    items: z.array(wasteItemSchema).min(1, "At least one item is required")
});


/**
 * ২. Waste Report/List দেখার জন্য স্কিমা (কুয়েরি প্যারামের জন্য)
 */
const getWasteQuerySchema = z.object({
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("10"),
    search: z.string().optional(),
    startDate: z.string().optional(), // YYYY-MM-DD
    endDate: z.string().optional(),
    productId: z.string().optional().refine((val) => !val || mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid Product ID filter"
    }),
    reason: z.enum(["Expired", "Damaged", "Lost", "Theft", "Other"]).optional()
});

module.exports = { 
    createBulkWasteSchema, 
    getWasteQuerySchema 
};