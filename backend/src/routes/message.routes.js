import express from "express";
import {
  sendMessage,
  getMessages,
  getConversations,
  markAsRead,
  getOrCreateConversation,
} from "../controllers/messageController.js";
import { verifyJWT } from "../middlewares/user.middleware.js";

const router = express.Router();

// ✅ Naya: conversation get/create (Contact button ke liye)
router.post("/conversation", verifyJWT, getOrCreateConversation);

// Message bhejo
router.post("/send", verifyJWT, sendMessage);

// Chat list
router.get("/conversations", verifyJWT, getConversations);

// Ek conversation ke messages
router.get("/:conversationId", verifyJWT, getMessages);

// Read mark karo
router.put("/read/:conversationId", verifyJWT, markAsRead);

export default router;