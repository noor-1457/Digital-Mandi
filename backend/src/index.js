import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import connectDB from "./db/index.js";
import  app  from "./app.js";
import Message from "./models/message.model.js";
import Conversation from "./models/conversation.model.js";
import User from "./models/user.model.js";
import { setSocketIO } from "./utils/socket.js"; // ✅ path check kar lein

// Load environment variables
dotenv.config({
  path: "./env",
});
connectDB().catch((err) => console.log("❌ DB Error:", err));

// HTTP server + Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  },
});

setSocketIO(io); // ✅ Initialize kar diya


// ============================================================
// ✅ Socket.IO Auth Middleware
// ============================================================
// Client jab connect karega, usay token bhejna hoga (handshake.auth mein)
// Hum token verify karenge, user nikalege, aur socket.user mein attach karenge
io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    socket.user = {
      _id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("Socket auth error:", error.message);
    next(new Error("Invalid token"));
  }
});
export { io };
// ============================================================
// ✅ Socket.IO Connection Handler
// ============================================================
io.on("connection", (socket) => {
  const userId = socket.user._id;
  console.log(`✅ User connected: ${userId} (socket: ${socket.id})`);

  // ✅ User apne userId wale room mein join kare
  // Isse hum usay directly message bhej sakte hain
  socket.join(userId);

  // ============================================================
  // ✅ EVENT: sendMessage
  // ============================================================
  // Client se data aayega: { receiverId, text }
  // Server: DB mein save karega, phir receiver ko push karega
  socket.on("sendMessage", async (data) => {
    try {
      const { receiverId, text } = data;

      if (!receiverId || !text) {
        return socket.emit("errorMessage", {
          message: "receiverId and text required",
        });
      }

      // 1. Conversation dhoondein ya banao
      let conversation = await Conversation.findOne({
        participants: { $all: [userId, receiverId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [userId, receiverId],
        });
      }

      // 2. Message DB mein save karein
      const newMessage = await Message.create({
        conversationId: conversation._id,
        senderId: userId,
        receiverId,
        text,
      });

      // 3. Conversation ka lastMessage update karein
      conversation.lastMessage = newMessage._id;
      conversation.lastMessageAt = newMessage.createdAt;
      await conversation.save();

      // ✅ 4. Sender ka naam fetch karein (YAHAN — sendMessage ke andar)
      const sender = await User.findById(userId).select("fullName");

      // 5. Sender ko confirm
      socket.emit("messageSent", newMessage);

      // ✅ 6. Receiver ko senderName ke saath bhejein
      io.to(receiverId).emit("newMessage", {
        ...newMessage.toObject(),
        senderName: sender?.fullName || "User",
      });

      console.log(
        `📩 Message from ${userId} to ${receiverId}: "${text.substring(0, 30)}..."`,
      );
    } catch (error) {
      console.error("sendMessage socket error:", error);
      socket.emit("errorMessage", { message: error.message });
    }
  });

  // ============================================================
  // ✅ EVENT: markAsRead
  // ============================================================
  socket.on("markAsRead", async (data) => {
    try {
      const { conversationId } = data;

      await Message.updateMany(
        { conversationId, receiverId: userId, read: false },
        { $set: { read: true } },
      );

      // Sender ko notify karein ke message padh liya gaya
      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        const otherUser = conversation.participants.find(
          (p) => p.toString() !== userId,
        );
        io.to(otherUser.toString()).emit("messagesRead", { conversationId });
      }
    } catch (error) {
      console.error("markAsRead socket error:", error);
    }
  });

  // ============================================================
  // ✅ EVENT: typing / stopTyping
  // ============================================================
  socket.on("typing", (data) => {
    const { receiverId } = data;
    if (receiverId) {
      io.to(receiverId).emit("userTyping", {
        userId,
        conversationId: data.conversationId,
      });
    }
  });

  socket.on("stopTyping", (data) => {
    const { receiverId } = data;
    if (receiverId) {
      io.to(receiverId).emit("userStoppedTyping", { userId });
    }
  });

  // ============================================================
  // ✅ EVENT: disconnect
  // ============================================================
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${userId} (socket: ${socket.id})`);
  });
});

// ============================================================
// ✅ Database connect + Server start
// ============================================================
const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`   Local:   http://localhost:${PORT}`);
      console.log(`   Network: http://192.168.x.x:${PORT} (phone ke liye)`);
      console.log(`   Socket.IO: enabled`);
    });
  })
  .catch((err) => {
    console.log("❌ Error while connecting to DB:", err);
    process.exit(1);
  });
