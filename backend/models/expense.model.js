const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  // কত টাকা খরচ হলো
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount cannot be negative"]
  },

  // খরচের ধরণ (Enum ব্যবহার করা ভালো যাতে ডাটাবেজে উল্টোপাল্টা নাম না যায়)
  category: {
    type: String,
    required: true,
    enum: ['Tea/Snacks', 'Transport', 'Cleaning', 'Utilities', 'Others'],
    default: 'Others'
  },

  // বিস্তারিত (যেমন: "মেহমানদের জন্য চা")
  description: {
    type: String,
    trim: true,
    maxLength: [200, "Description cannot exceed 200 characters"]
  },

  // কোন সেলসম্যান খরচটি এন্ট্রি করলো
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // কোন শিফটে এই খরচটি হয়েছে (এটি আপনার ক্যাশ মিলানোর জন্য লাগবে)
  shiftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift',
    default: null // অ্যাডমিন সরাসরি খরচ করলে শিফট আইডি নাও থাকতে পারে
  },

  // খরচটি কি রেজিস্টার/ক্যাশ ড্রয়ার থেকে হয়েছে? 
  // সেলসম্যান করলে এটি সব সময় true হবে
  isFromRegister: {
    type: Boolean,
    default: true
  },

  // খরচ করার সময় ও তারিখ
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;