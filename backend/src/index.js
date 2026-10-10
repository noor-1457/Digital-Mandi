import dotenv from "dotenv";
import http from "http"; // ✅ 1. HTTP module import karein (Socket.IO ke liye zaroori)
import connectDB from "./db/index.js";
import { app } from "./app.js";

// Load environment variables from .env file
dotenv.config({
  path: "./env", // Load env as soon as server starts
});

// ✅ 2. HTTP server banayein Express app se
//    Kyun? Socket.IO ko http.Server instance chahiye, Express app nahi
//    Agar direct app.listen() karein toh baad mein Socket.IO attach nahi hoga
const server = http.createServer(app);

// ============================================================
// ✅ 3. Yahan baad mein Socket.IO attach karenge (abhi nahi)
// ============================================================
// import { Server } from "socket.io";
// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//       process.env.FRONTEND_URL,
//     ].filter(Boolean),
//     credentials: true,
//   },
// });
//
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);
//   // ... chat logic yahan aayega
// });
// ============================================================

// ✅ 4. Database connect + server start
const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    // ✅ 5. "0.0.0.0" par bind karein — Render/local network ke liye zaroori
    //    Isse phone bhi same network se server access kar sakega
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`   Local:   http://localhost:${PORT}`);
      console.log(`   Network: http://192.168.x.x:${PORT} (phone ke liye)`);
    });
  })
  .catch((err) => {
    console.log("❌ Error while connecting to DB:", err);
    process.exit(1);
  });