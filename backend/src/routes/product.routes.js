import { Router } from "express";

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";

import upload from "../middlewares/multer.middleware.js";

const router = Router();

// Create Product
router.post(
    "/",
    upload.single("image"),
    createProduct
);

// Get All Products
router.get(
    "/",
    getProducts
);

// Get Product By ID
router.get(
    "/:id",
    getProductById
);

// Update Product
router.put(
    "/:id",
    updateProduct
);

// Delete Product
router.delete(
    "/:id",
    deleteProduct
);

export default router;