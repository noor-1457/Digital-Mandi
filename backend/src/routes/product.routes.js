import { Router } from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import upload from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/user.middleware.js";

console.log("🔥 PRODUCT ROUTES FILE LOADED");

const router = Router();

// ==================== CREATE PRODUCT ====================

router.post(
  "/",
  verifyJWT,
  (req, res, next) => {
    console.log("🔥 CREATE PRODUCT REQUEST RECEIVED");
    console.log("🔥 USER:", req.user?._id);
    next();
  },
  upload.single("image"),
  createProduct
);

// ==================== GET MY PRODUCTS ====================

router.get(
  "/my-products",
  verifyJWT,
  (req, res, next) => {
    console.log("🔥 GET MY PRODUCTS REQUEST RECEIVED");
    console.log("🔥 USER:", req.user?._id);
    next();
  },
  getMyProducts
);

// ==================== GET ALL PRODUCTS ====================

router.get("/", getProducts);

// ==================== GET PRODUCT BY ID ====================

router.get("/:id", getProductById);

// ==================== UPDATE PRODUCT ====================

router.put(
  "/:id",
  verifyJWT,
  upload.single("image"),
  updateProduct
);

// ==================== DELETE PRODUCT ====================

router.delete(
  "/:id",
  verifyJWT,
  deleteProduct
);

export default router;