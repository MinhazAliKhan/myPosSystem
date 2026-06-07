const categoryService = require("../services/category.service");

// ✅ Create Category
exports.createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get All Categories (With Search & Pagination)
exports.getCategories = async (req, res, next) => {
  try {
    const result = await categoryService.getAllCategories(req.query);
    res.status(200).json({
      success: true,
      ...result, // এটা data, total, page, limit সব পাঠাবে
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get Single Category
exports.getCategory = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// ✅ Update Category
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete Category (Soft Delete)
exports.deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};