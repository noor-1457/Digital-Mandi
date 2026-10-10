import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";

dotenv.config();

const app = express();

// ============================================================
// ✅ CORS — Allowed Origins
// ============================================================
// Kyun array? Kyunki humein 3 jagah se requests aayengi:
//   1. Local laptop:     http://localhost:5173
//   2. Phone (same WiFi): http://192.168.x.x:5173
//   3. Deployed frontend: https://your-app.netlify.app (env se)
//
// Isliye hum teenon ko allow karenge.
// `process.env.FRONTEND_URL` Render ke Environment Variables se aayega.
// `.filter(Boolean)` — agar koi URL undefined ho toh array se hata dega.
// ============================================================
const allowedOrigins = [
  "http://localhost:5173",         // Local laptop (Vite)
  "http://localhost:3000",         // Local laptop (CRA, agar use karein)
  "http://127.0.0.1:5173",         // Local (127.0.0.1 variant)
  process.env.FRONTEND_URL,        // Netlify URL (deploy ke baad)
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Postman ya curl se aane wali requests mein origin nahi hota
      if (!origin) return callback(null, true);

      // Agar origin allowed list mein hai toh allow karo
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Local network IPs (192.168.x.x, 10.x.x.x, 172.x.x.x) allow karo
      // Isse phone same WiFi se connect kar sakta hai
      const isLocalNetwork = /^http:\/\/(192\.168|10\.|172\.(1[6-9]|2\d|3[01]))\.\d+\.\d+(:\d+)?$/.test(origin);
      if (isLocalNetwork) {
        return callback(null, true);
      }

      // Warna block karo
      console.log("❌ CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // Cookies allow karne ke liye zaroori
  }),
);

// Body Parser
app.use(express.json({ limit: "16kb" })); // Parse JSON
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Parse URL encoded

// Cookie Parser
app.use(cookieParser());

// ============================================================
// ✅ Health Check Route (Render ke liye useful)
// ============================================================
// Render periodically is route ko hit karta hai yeh check karne ke liye
// ke server zinda hai ya nahi.
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