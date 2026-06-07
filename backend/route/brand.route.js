const express = require("express");
const router = express.Router();

// কন্ট্রোলার ইম্পোর্ট
const brandController = require("../controllers/brand.controller");

// মিডলওয়্যার ইম্পোর্ট (আপনার প্রোজেক্টের পাথ অনুযায়ী চেক করে নিন)
const { authMiddleware, allowRoles } = require("../middlewares/auth-middleware");
const validate = require("../middlewares/validate-middleware");
const { createBrandSchema, updateBrandSchema } = require("../validation/brand.validation");

// ১. সব রুটের জন্য আগে লগইন (Authentication) চেক করবে
router.use(authMiddleware);

//---------------------------------------------------------
// ২. ব্র্যান্ড লিস্ট দেখা (GET)
// URL: GET http://localhost:5000/api/v1/brands
//---------------------------------------------------------
router.get("/getBrands", brandController.getBrands);

//---------------------------------------------------------
// ৩. নতুন ব্র্যান্ড তৈরি করা (POST)
// শুধুমাত্র ADMIN পারবে এবং Zod দিয়ে ডাটা চেক হবে
// URL: POST http://localhost:5000/api/v1/brands
//---------------------------------------------------------
router.post(
  "/createBrand", 
  allowRoles("ADMIN"), 
  validate(createBrandSchema), 
  brandController.createBrand
);

//---------------------------------------------------------
// ৪. নির্দিষ্ট একটি ব্র্যান্ড দেখা (GET by ID)
// URL: GET http://localhost:5000/api/v1/brands/:id
//---------------------------------------------------------
router.get("/getBrand/:id", brandController.getBrand);

//---------------------------------------------------------
// ৫. ব্র্যান্ড আপডেট করা (PATCH)
// শুধুমাত্র ADMIN পারবে এবং Zod দিয়ে ডাটা চেক হবে
// URL: PATCH http://localhost:5000/api/v1/brands/:id
//---------------------------------------------------------
router.patch(
  "/updateBrand/:id", 
  allowRoles("ADMIN"), 
  validate(updateBrandSchema), 
  brandController.updateBrand
);

//---------------------------------------------------------
// ৬. ব্র্যান্ড সফট-ডিলিট করা (DELETE)
// শুধুমাত্র ADMIN পারবে
// URL: DELETE http://localhost:5000/api/v1/brands/:id
//---------------------------------------------------------
router.delete("/deleteBrand/:id", allowRoles("ADMIN"), brandController.deleteBrand);

module.exports = router;