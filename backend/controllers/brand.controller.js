const brandService = require("../services/brand.service");

// ✅ Create Brand
exports.createBrand = async (req, res, next) => {
  try {
    const brand = await brandService.createBrand(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: brand,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get All Brands (With Search & Pagination)
exports.getBrands = async (req, res, next) => {
  try {
    const result = await brandService.getAllBrands(req.query);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get Single Brand
exports.getBrand = async (req, res, next) => {
  try {
    const brand = await brandService.getBrandById(req.params.id);
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// ✅ Update Brand
exports.updateBrand = async (req, res, next) => {
  try {
    const brand = await brandService.updateBrand(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      data: brand,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete Brand (Soft Delete)
exports.deleteBrand = async (req, res, next) => {
  try {
    await brandService.deleteBrand(req.params.id);
    res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};