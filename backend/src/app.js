import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import messageRoutes from "./routes/message.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import contactRoutes from "./routes/contact.routes.js";

dotenv.config();

const app = express();

// ============================================================
// ✅ CORS — Allowed Origins
// ============================================================
const allowedOrigins = [
  "http://localhost:5173",         // Local laptop (Vite)
  "http://localhost:3000",         
  "http://127.0.0.1:5173",         
  process.env.FRONTEND_URL,        // Vercel Env se aayega
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman ya curl se aane wali requests
      if (!origin) return callback(null, true);

      // Agar origin allowed list mein hai
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Local network IPs (192.168.x.x, 10.x.x.x, 172.x.x.x)
      const isLocalNetwork = /^http:\/\/(192\.168|10\.|172\.(1[6-9]|2\d|3[01]))\.\d+\.\d+(:\d+)?$/.test(origin);
      if (isLocalNetwork) {
        return callback(null, true);
      }

      // Warna block karo
      console.log("❌ CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Methods allow kiye
    allowedHeaders: ["Content-Type", "Authorization"],   // ✅ Headers allow kiye
  }),
);

// ✅ Vercel Preflight (OPTIONS) fix: Yeh line sabse zaroori hai
app.options("*", cors());

// Body Parser
app.use(express.json({ limit: "16kb" })); 
app.use(express.urlencoded({ extended: true, limit: "16kb" })); 

// Cookie Parser
app.use(cookieParser());

// ============================================================
// ✅ Health Check Route (Vercel ke liye)
// ============================================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Digital Mandi API is running",
  });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

// ERROR HANDLING
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export { app };