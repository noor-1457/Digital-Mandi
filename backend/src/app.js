import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";

dotenv.config();

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Body Parser
app.use(express.json({ limit: "16kb" })); // Parse JSON
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Parse URL encoded

// Cookie Parser
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

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
