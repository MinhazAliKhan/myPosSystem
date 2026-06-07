const Supplier = require("../models/supplier.model");

/**
 * @desc Get all suppliers with pagination and search (Name & Phone)
 */
exports.getSuppliers = async (queries) => {
  const { search, page = 1, limit = 10 } = queries;
  
  // ১. বেসিক ফিল্টার
  let filter = { isDeleted: false };

  // ২. সার্চ লজিক
  if (search) {
    const cleanSearch = String(search).trim();
    
    // ফোন নাম্বার সার্চ করার জন্য RegExp অবজেক্ট সবচেয়ে শক্তিশালী
    const searchRegex = new RegExp(cleanSearch, 'i');

    filter = {
      $and: [
        { isDeleted: false }, // আপনার পার্শিয়াল ইন্ডেক্সকে টার্গেট করার জন্য
        {
          $or: [
            { name: searchRegex },
            { phone: searchRegex }
          ]
        }
      ]
    };
  }

  try {
    const skip = (Number(page) - 1) * Number(limit);
    
    // ৩. ডাটা ফেচ করা
    const [suppliers, total] = await Promise.all([
      Supplier.find(filter)
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit))
        .populate("recordedBy", "name"),
      Supplier.countDocuments(filter)
    ]);

    return {
      suppliers,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    };
  } catch (error) {
    console.error("Search Error:", error.message);
    throw new Error("Phone search failed: " + error.message);
  }
};
/**
 * @desc Create new supplier or restore if deleted
 */
exports.createSupplier = async (data, userId) => {
  const { name, phone } = data;
  
  // নাম অথবা ফোন নম্বর দিয়ে চেক করা হচ্ছে (ইন্ডেক্স ইউনিক তাই)
  const existing = await Supplier.findOne({
    $or: [{ name: name.trim() }, { phone: phone.trim() }]
  });

  if (existing) {
    if (existing.isDeleted) {
      // যদি আগে ডিলিট করা থাকে, তবে রিস্টোর হবে
      existing.isDeleted = false;
      Object.assign(existing, { ...data, recordedBy: userId });
      return await existing.save();
    }
    // যদি একটিভ থাকে তবে এরর দেবে
    const field = existing.name === name.trim() ? "Name" : "Phone number";
    throw new Error(`${field} already exists in active suppliers`);
  }
  
  return await Supplier.create({ ...data, recordedBy: userId });
};

/**
 * @desc Get single supplier by ID
 */
exports.getSupplierById = async (id) => {
  const supplier = await Supplier.findOne({ _id: id, isDeleted: false });
  if (!supplier) throw new Error("Supplier not found");
  return supplier;
};

/**
 * @desc Update supplier details
 */
exports.updateSupplier = async (id, updateData) => {
  const { name, phone } = updateData;

  // আপডেট করার সময় নাম বা ফোন অন্য কারোর সাথে মিলছে কি না চেক
  if (name || phone) {
    const conflict = await Supplier.findOne({
      $or: [
        name ? { name: name.trim() } : null,
        phone ? { phone: phone.trim() } : null
      ].filter(Boolean),
      _id: { $ne: id },
      isDeleted: false
    });
    if (conflict) throw new Error("Name or Phone is already being used by another supplier");
  }

  const result = await Supplier.findByIdAndUpdate(id, updateData, { new: true });
  if (!result) throw new Error("Supplier not found or update failed");
  return result;
};

/**
 * @desc Soft delete supplier
 */
exports.deleteSupplier = async (id) => {
  const result = await Supplier.findByIdAndUpdate(
    id, 
    { isDeleted: true }, 
    { new: true }
  );
  if (!result) throw new Error("Supplier not found");
  return result;
};