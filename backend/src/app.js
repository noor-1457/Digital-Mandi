import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);

// Body Parser
app.use(express.json({ limit: "16kb" })); // Parse JSON
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Parse URL encoded

// Cookie Parser
app.use(cookieParser());

// Auth routes
app.use("/api/auth", authRoutes);

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
