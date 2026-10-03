import express from "express";
import {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus,
  getOrderById,
} from "../controllers/orderController.js";
import { verifyJWT } from "../middlewares/user.middleware.js";

const router = express.Router();

// ================= BUYER ROUTES =================
router.post("/create-order", verifyJWT, createOrder);

router.get("/my-orders", verifyJWT, getMyOrders);

// ================= FARMER ROUTES =================
router.get("/farmer-orders", verifyJWT, getFarmerOrders);

router.put("/:orderId/status", verifyJWT, updateOrderStatus);

// ================= COMMON =================
router.get("/:orderId", verifyJWT, getOrderById);

export default router;
