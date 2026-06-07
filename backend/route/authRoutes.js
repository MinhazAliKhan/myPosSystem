const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const validate = require("../middlewares/validate-middleware");
const { registerSchema, loginSchema } = require("../validation/auth-validation");
const { authMiddleware } = require("../middlewares/auth-middleware");

// REGISTER
router.post(
  "/register",
  validate(registerSchema),
  authController.registerUser
);

// LOGIN
router.post(
  "/login",
  validate(loginSchema),
  authController.loginUser
);

// REFRESH TOKEN
router.get("/refresh", authController.refreshToken);

// LOGOUT
router.post("/logout", authController.logout);

// GET PROFILE (protected)
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;
