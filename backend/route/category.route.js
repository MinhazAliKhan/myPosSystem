const express = require("express");
const router = express.Router();
const controller = require("../controllers/category.controller");
const { authMiddleware, allowRoles } = require("../middlewares/auth-middleware");
const validate = require("../middlewares/validate-middleware");
const { 
  createCategorySchema, 
  updateCategorySchema, 
  categoryIdParamSchema 
} = require("../validation/category.validation");

// সব রুটে লগইন আবশ্যক
router.use(authMiddleware);

router.post(
  "/createCategory", 
  allowRoles("ADMIN"), // আপনার রোলের নাম যদি বড় হাতের হয়
  validate(createCategorySchema), 
  controller.createCategory
);

router.get(
  "/getCategories", 
  allowRoles("ADMIN", "MANAGER", "SALESMAN"), 
  controller.getCategories
);

router.get(
  "/getCategory/:id", 
  validate(categoryIdParamSchema, "params"), 
  allowRoles("ADMIN", "MANAGER", "SALESMAN"), 
  controller.getCategory
);

router.patch(
  "/updateCategory/:id", 
  allowRoles("ADMIN"), 
  validate(categoryIdParamSchema, "params"), 
  validate(updateCategorySchema), 
  controller.updateCategory
);

router.delete(
  "/deleteCategory/:id", 
  allowRoles("ADMIN"), 
  validate(categoryIdParamSchema, "params"), 
  controller.deleteCategory
);

module.exports = router;