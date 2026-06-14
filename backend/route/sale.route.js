const express = require("express");
const router = express.Router();
const saleController = require("../controllers/sale.controller");
const { authMiddleware, allowRoles } = require("../middlewares/auth-middleware");
const validate = require("../middlewares/validate-middleware");
const { createSaleSchema, saleIdParamSchema, voidSaleSchema, getSalesQuerySchema } = require("../validation/sale.validation");

router.use(authMiddleware);

router.post("/create", allowRoles("SALESMAN"), validate(createSaleSchema, "body"), saleController.createSale);
router.get("/", allowRoles("ADMIN", "SALESMAN"), validate(getSalesQuerySchema, "query"), saleController.getSales);
router.patch("/:id/void", allowRoles("ADMIN", "SALESMAN"), validate(saleIdParamSchema, "params"), validate(voidSaleSchema, "body"), saleController.voidSale);
router.patch("/:id/refund", allowRoles("ADMIN"), validate(saleIdParamSchema, "params"), validate(voidSaleSchema, "body"), saleController.refundSale);
router.get("/top-items", allowRoles("ADMIN", "SALESMAN"), saleController.getTopItems);
router.post("/expense", allowRoles("SALESMAN", "ADMIN"), saleController.addExpense);
router.get("/kitchen-orders", authMiddleware, allowRoles("ADMIN", "MANAGER", "KITCHEN"), saleController.getKitchenOrders);
// এটি কিচেন অডার রিমুভ করার জন্য
router.patch("/:id/status", allowRoles("KITCHEN", "ADMIN"), saleController.updateSaleStatus);
module.exports = router;