import express from "express";
import {
  createContactMessage,
  getAllContactMessages,
  markContactAsRead,
} from "../controllers/contactController.js";
import { verifyJWT } from "../middlewares/user.middleware.js";

const router = express.Router();

// Public route (koi bhi contact kar sakta hai)
router.post("/", createContactMessage);

// Admin routes
router.get("/", verifyJWT, getAllContactMessages);
router.put("/:id/read", verifyJWT, markContactAsRead);

export default router;