const express = require("express");
const router = express.Router();
const controller = require("../controllers/unit.controller");
const { authMiddleware, allowRoles } = require("../middlewares/auth-middleware");
const validate = require("../middlewares/validate-middleware");
const { createUnitSchema, updateUnitSchema, unitIdParamSchema } = require("../validation/unit.validation");

router.use(authMiddleware);

router.post("/createUnit", allowRoles("ADMIN"), validate(createUnitSchema), controller.createUnit);
router.get("/getUnits", allowRoles("ADMIN", "MANAGER", "SALESMAN"), controller.getUnits);
router.get("/getUnit/:id", allowRoles("ADMIN", "MANAGER", "SALESMAN"), validate(unitIdParamSchema, "params"), controller.getUnit);
router.patch("/updateUnit/:id", allowRoles("ADMIN"), validate(unitIdParamSchema, "params"), validate(updateUnitSchema), controller.updateUnit);
router.delete("/deleteUnit/:id", allowRoles("ADMIN"), validate(unitIdParamSchema, "params"), controller.deleteUnit);

module.exports = router;