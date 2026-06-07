const Category = require("../models/category.model");

// CREATE & RESTORE (The Most Robust Way)
const createCategory = async (data, userId) => {
  const name = data.name.trim();
  const slug = name.toLowerCase().split(" ").join("-");

  // ১. ডিলিটেড বা একটিভ - সব মিলিয়ে চেক করুন
  const existingCategory = await Category.findOne({ name }).select("+isDeleted");

  if (existingCategory) {
    if (existingCategory.isDeleted) {
      // ২. রিস্টোর লজিক: পুরাতন ডাটা আপডেট করে সচল করা
      existingCategory.isDeleted = false;
      existingCategory.isActive = data.isActive !== undefined ? data.isActive : true;
      existingCategory.createdBy = userId;
      existingCategory.name = name;
      existingCategory.slug = slug;
      existingCategory.description = data.description || existingCategory.description;
      
      return await existingCategory.save();
    } else {
      // যদি অলরেডি একটিভ থাকে
      throw new Error("Category with this name already exists and is active");
    }
  }

  // ৩. একদম নতুন ক্যাটাগরি তৈরি
  const categoryData = {
    name,
    slug,
    description: data.description,
    isActive: data.isActive !== undefined ? data.isActive : true,
    createdBy: userId
  };

  // .save() এর বদলে সরাসরি .create() ব্যবহার করা নিরাপদ
  return await Category.create(categoryData);
};

// GET ALL (নিশ্চিত করুন Pagination ঠিক আছে)
const getAllCategories = async (query) => {
  const { search, page = 1, limit = 10 } = query;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, parseInt(limit) || 10);
  const skip = (pageNum - 1) * limitNum;

  const filter = { isDeleted: false };
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const [data, total] = await Promise.all([
    Category.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Category.countDocuments(filter)
  ]);

  return { data, total, page: pageNum, limit: limitNum };
};

// UPDATE
const updateCategory = async (id, data) => {
  const category = await Category.findOne({ _id: id, isDeleted: false });
  if (!category) throw new Error("Category not found");

  if (data.name) {
    const exists = await Category.findOne({ 
      name: data.name.trim(), 
      isDeleted: false, 
      _id: { $ne: id } 
    });
    if (exists) throw new Error("Category name already taken");
    category.slug = data.name.trim().toLowerCase().split(" ").join("-");
    category.name = data.name.trim();
  }

  if (data.description !== undefined) category.description = data.description;
  if (data.isActive !== undefined) category.isActive = data.isActive;

  return await category.save();
};

// DELETE
const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new Error("Category not found");
  
  category.isDeleted = true;
  return await category.save();
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
};