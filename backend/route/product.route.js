const router = require("express").Router();
const controller = require("../controllers/product.controller");
const { authMiddleware, allowRoles } = require("../middlewares/auth-middleware");
const validate = require("../middlewares/validate-middleware");
const { createProductSchema, updateProductSchema, productIdParamSchema } = require("../validation/product.validation");

router.use(authMiddleware);

// Create
router.post("/createProduct", allowRoles("ADMIN"), validate(createProductSchema), controller.createProduct);

// Get All
router.get("/getAllProducts", allowRoles("ADMIN", "SALESMAN"), controller.getProducts);

// Get Single
router.get("/getProduct/:id", allowRoles("ADMIN", "SALESMAN"), validate(productIdParamSchema, "params"), controller.getProduct);

// Update (এখানে স্লাশ '/' যোগ করা হয়েছে এবং ভ্যালিডেশন অর্ডারিং ঠিক করা হয়েছে)
router.patch("/updateProduct/:id", allowRoles("ADMIN"), validate(productIdParamSchema, "params"), validate(updateProductSchema), controller.updateProduct);

// Delete
router.delete("/deleteProduct/:id", allowRoles("ADMIN"), validate(productIdParamSchema, "params"), controller.deleteProduct);

// Restore (আপনার আগের মডিউলগুলোর মতো যদি আলাদা এন্ডপয়েন্ট রাখতে চান)
router.patch("/restoreProduct/:id", allowRoles("ADMIN"), validate(productIdParamSchema, "params"), controller.restoreProduct);

module.exports = router;