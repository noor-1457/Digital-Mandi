import express from "express";
import {
  getAdminStats,
  getAllUsers,
  toggleUserBlock,
  getAllProductsAdmin,
  getAllOrdersAdmin,
} from "../controllers/adminController.js";
import { verifyJWT } from "../middlewares/user.middleware.js";

const router = express.Router();

// Saare routes protected hain (verifyJWT lagega)
// Baad mein hum role check bhi laga sakte hain (allowedRoles: admin)
router.get("/stats", verifyJWT, getAdminStats);
router.get("/users", verifyJWT, getAllUsers);
router.put("/users/:userId/block", verifyJWT, toggleUserBlock);
router.get("/products", verifyJWT, getAllProductsAdmin);
router.get("/orders", verifyJWT, getAllOrdersAdmin);

export default router;