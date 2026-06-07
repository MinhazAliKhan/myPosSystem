const Product = require("../models/product.model");
const slugify = require("slugify");
const { customAlphabet } = require("nanoid");

const generateSKU = () => {
  const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
  return `PRD-${nanoid()}`;
};

exports.createProduct = async (data, userId) => {
  if (data.costPrice !== undefined && Number(data.costPrice) > Number(data.price)) {
    throw new Error("Cost price cannot be greater than selling price");
  }

  const existingProduct = await Product.findOne({ name: data.name }).select("+isDeleted");
  const allowedFields = ["name", "sku", "price", "costPrice", "unit", "category", "brand", "stock", "lowStockLevel", "isActive"];

  if (existingProduct) {
    if (existingProduct.isDeleted === true) {
      existingProduct.isDeleted = false;
      existingProduct.deletedBy = null;
      existingProduct.updatedBy = userId;
      existingProduct.slug = slugify(data.name, { lower: true, strict: true });

      if (!data.sku || data.sku.trim() === "") {
        existingProduct.sku = generateSKU();
      }

      allowedFields.forEach((field) => {
        if (data[field] !== undefined) existingProduct[field] = data[field];
      });

      return await existingProduct.save();
    } else {
      throw new Error("Product with this name already exists and is active.");
    }
  }

  const productData = { 
    createdBy: userId, 
    slug: slugify(data.name, { lower: true, strict: true }),
    sku: (data.sku && data.sku.trim() !== "") ? data.sku : generateSKU()
  };

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) productData[field] = data[field];
  });

  return await Product.create(productData);
};

// GET ALL - সর্টিং ফিক্সড
exports.getAllProducts = async (query) => {
  const { 
    search, category, brand, isActive, minPrice, maxPrice, 
    sortBy = "createdAt", sortOrder = "desc", page = 1, limit = 10 
  } = query;

  const filters = { isDeleted: false };

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } }
    ];
  }

  if (category) filters.category = category;
  if (brand) filters.brand = brand;
  
  if (isActive !== undefined && isActive !== "") {
    filters.isActive = isActive === "true" || isActive === true;
  }

  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = Number(minPrice);
    if (maxPrice) filters.price.$lte = Number(maxPrice);
  }

  // ফিক্সড সর্টিং লজিক
  const [data, total] = await Promise.all([
    Product.find(filters)
      .populate("category", "name")
      .populate("brand", "name")
      .populate("unit", "name shortName")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .collation(sortBy === 'name' ? { locale: 'en', strength: 2 } : {}) 
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit)),
    Product.countDocuments(filters)
  ]);

  return {
    data,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPage: Math.ceil(total / Number(limit))
    }
  };
};

exports.getProductById = async (id) => {
  const product = await Product.findOne({ _id: id, isDeleted: false })
    .populate("category brand unit");
  if (!product) throw new Error("Product not found");
  return product;
};

exports.updateProduct = async (id, data, userId) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) throw new Error("Product not found");

  if (data.name && data.name !== product.name) {
    product.slug = slugify(data.name, { lower: true, strict: true });
  }

  const allowedFields = ["name", "sku", "price", "costPrice", "unit", "category", "brand", "stock", "lowStockLevel", "isActive"];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) product[field] = data[field];
  });

  product.updatedBy = userId;
  return await product.save();
};

exports.deleteProduct = async (id, userId) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) throw new Error("Product not found");
  product.isDeleted = true;
  product.deletedBy = userId;
  return await product.save();
};

exports.restoreProduct = async (id) => {
  const product = await Product.findOne({ _id: id, isDeleted: true });
  if (!product) throw new Error("Product not found in trash");
  product.isDeleted = false;
  product.deletedBy = null;
  product.isActive = true;
  return await product.save();
};