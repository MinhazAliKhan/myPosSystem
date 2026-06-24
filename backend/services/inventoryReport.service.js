const Product = require("../models/product.model");

exports.getInventoryReport = async () => {
  return await Product.aggregate([
    { $match: { isDeleted: false, isActive: true } },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category"
      }
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        inventoryStatus: {
          $switch: {
            branches: [
              { case: { $eq: ["$stock", 0] }, then: "OUT_OF_STOCK" },
              { case: { $lte: ["$stock", "$lowStockLevel"] }, then: "LOW_STOCK" }
            ],
            default: "IN_STOCK"
          }
        }
      }
    },
    { $sort: { stock: 1 } }
  ]);
};