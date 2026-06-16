const express = require("express");
const router = express.Router();
const controller = require("../controllers/purchase.controller");
const { authMiddleware, allowRoles } = require("../middlewares/auth-middleware");
const validate = require("../middlewares/validate-middleware");
const { createPurchaseSchema, updatePurchaseSchema, purchaseIdParamSchema } = require("../validation/purchase.validation");

router.use(authMiddleware);

// Get All
router.get("/", allowRoles("ADMIN", "MANAGER", "SALESMAN"), controller.getAllPurchases);

// Get By ID
router.get("/:id", allowRoles("ADMIN", "MANAGER", "SALESMAN"), validate(purchaseIdParamSchema, "params"), controller.getPurchaseById);

// Create
router.post("/create", allowRoles("ADMIN", "MANAGER"), validate(createPurchaseSchema), controller.createPurchase);

// Update
router.patch("/update/:id", allowRoles("ADMIN", "MANAGER"), validate(purchaseIdParamSchema, "params"), validate(updatePurchaseSchema), controller.updatePurchase);

// Delete
router.delete("/delete/:id", allowRoles("ADMIN"), validate(purchaseIdParamSchema, "params"), controller.deletePurchase);

module.exports = router;