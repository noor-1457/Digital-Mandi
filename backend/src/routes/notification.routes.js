import express from "express";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";
import { verifyJWT } from "../middlewares/user.middleware.js";

const router = express.Router();

// ================= PROTECTED ROUTES =================
// User login hona chahiye notification dekhne ke liye

// Apni saari notifications fetch karein
router.get("/", verifyJWT, getMyNotifications);

// Ek notification ko read mark karein
router.put("/:notificationId/read", verifyJWT, markAsRead);

// Saari notifications ko read mark karein
router.put("/read-all", verifyJWT, markAllAsRead);

export default router;