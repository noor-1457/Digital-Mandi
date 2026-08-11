import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// Load environment variables from .env file
dotenv.config({
  path: "./env", // Load env as soon as server starts
});

// DATABASE CONNECTION & SERVER START

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
      console.log(`http://localhost:${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to DB:", err);
    process.exit(1);
  });
