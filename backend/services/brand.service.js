const Brand = require("../models/brand.model");

/**
 * @desc    Create a new Brand
 * @route   POST /api/v1/brands
 */
exports.createBrand = async (data, userId) => {
  // ১. ডিলিটেডসহ চেক করুন
  const existingBrand = await Brand.findOne({ name: data.name });

  if (existingBrand) {
    if (existingBrand.isDeleted) {
      // রিস্টোর লজিক
      existingBrand.isDeleted = false;
      existingBrand.isActive = data.isActive !== undefined ? data.isActive : true;
      existingBrand.createdBy = userId;
      existingBrand.name = data.name;
      existingBrand.description = data.description || existingBrand.description;
      return await existingBrand.save();
    } else {
      throw new Error("Brand with this name already exists");
    }
  }

  // ২. নতুন ব্র্যান্ড ক্রিয়েশন
  const allowedFields = ["name", "description", "isActive"];
  const brandData = { createdBy: userId };

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) brandData[field] = data[field];
  });

  return await new Brand(brandData).save();
};
/**
 * @desc    Get all Brands with Search, Sort and Pagination
 * @route   GET /api/v1/brands
 */
exports.getAllBrands = async (query) => {
  const { 
    search, 
    sortBy = "createdAt", 
    sortOrder = "desc", 
    page = 1, 
    limit = 10 
  } = query;

  // ১. ফিল্টার সেট করা (শুধুমাত্র ডিলিট না হওয়া ব্র্যান্ডগুলো)
  const filter = { isDeleted: false };
  
  // ২. সার্চ লজিক (Case-insensitive search)
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  // ৩. প্যাজিনেশন এবং সর্টিং লজিক
  const skip = (page - 1) * limit;
  const data = await Brand.find(filter)
    .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
    .skip(skip)
    .limit(Number(limit));

  // ৪. টোটাল ডাটা কাউন্ট করা (ফ্রন্টএন্ডে প্যাজিনেশন দেখানোর জন্য)
  const total = await Brand.countDocuments(filter);

  return { 
    data, 
    total, 
    page: Number(page), 
    limit: Number(limit),
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * @desc    Get Single Brand by ID
 * @route   GET /api/v1/brands/:id
 */
exports.getBrandById = async (id) => {
  const brand = await Brand.findOne({ _id: id, isDeleted: false });
  if (!brand) throw new Error("Brand not found");
  return brand;
};

/**
 * @desc    Update Brand
 * @route   PATCH /api/v1/brands/:id
 */
exports.updateBrand = async (id, data) => {
  const brand = await Brand.findOne({ _id: id, isDeleted: false });
  if (!brand) throw new Error("Brand not found");

  // শুধুমাত্র নির্দিষ্ট ফিল্ডগুলো আপডেট করা
  const allowedFields = ["name", "description", "isActive"];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) brand[field] = data[field];
  });

  return await brand.save();
};

/**
 * @desc    Delete Brand (Soft Delete)
 * @route   DELETE /api/v1/brands/:id
 */
exports.deleteBrand = async (id) => {
  const brand = await Brand.findById(id);
  if (!brand) throw new Error("Brand not found");

  // ডাটাবেস থেকে ডিলিট না করে Flag পরিবর্তন করা
  brand.isDeleted = true;
  return await brand.save();
};