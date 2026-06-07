const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Unit name is required"], // যেমন: Piece, Kilogram
        unique: true,
        trim: true,
    },
    shortName: {
        type: String,
        required: [true, "Short name is required"], // যেমন: Pcs, Kg
        unique: true,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Unit", unitSchema);