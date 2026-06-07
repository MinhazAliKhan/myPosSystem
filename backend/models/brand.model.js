const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Brand name is required"],
        // unique: true বাদ দেওয়া হয়েছে কারণ আমরা সফট ডিলিট ব্যবহার করছি
        trim: true,
        index: true
    },
    description: {
        type: String,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        // select: false ই থাক যাতে অটোমেটিক সব জায়গায় না আসে
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Brand", brandSchema);