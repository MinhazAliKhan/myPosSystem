const productService = require("../services/product.service");

exports.createProduct = async (req, res, next) => {
  try {
    // req.user.id পাস করা হচ্ছে createdBy হিসেবে
    const data = await productService.createProduct(req.body, req.user.id);
    res.status(201).json({ success: true, message: "Product created successfully", data });
  } catch (err) { next(err); }
};

exports.getProducts = async (req, res, next) => {
    try {
        const result = await productService.getAllProducts(req.query);
        
        res.status(200).json({ 
            success: true, 
            message: "Products fetched successfully", 
            meta: result.meta, 
            data: result.data 
        });
    } catch (error) { 
        next(error); 
    }
};

exports.getProduct = async (req, res, next) => {
  try {
    const data = await productService.getProductById(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const data = await productService.updateProduct(req.params.id, req.body, req.user.id);
    res.json({ success: true, message: "Product updated successfully", data });
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id, req.user.id);
    res.json({ success: true, message: "Product moved to trash" });
  } catch (err) { next(err); }
};

// Restore logic যোগ করা হয়েছে
exports.restoreProduct = async (req, res, next) => {
  try {
    const data = await productService.restoreProduct(req.params.id);
    res.json({ success: true, message: "Product restored successfully", data });
  } catch (err) { next(err); }
};