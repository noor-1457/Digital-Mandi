import {ApiError} from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // 1️⃣ Token extract karein
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(new ApiError(401, "Unauthorized request - No token"));
    }

    // 2️⃣ Token verify karein
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3️⃣ Safe ID extraction (Optional chaining lagayi hai taaki code safe rahay)
    const idToSearch = decodedToken?._id || decodedToken?.userId || decodedToken?.id;

    if (!idToSearch) {
      return next(new ApiError(401, "Invalid token payload - User ID missing"));
    }

    // 4️⃣ User ko DB se fetch karein
    const user = await User.findById(idToSearch).select("-password -refreshToken");

    if (!user) {
      return next(new ApiError(401, "Unauthorized request - User not found"));
    }

    // 5️⃣ User context attach karein
    req.user = user;
    
    // Explicit server log check:
    console.log("🟢 [MIDDLEWARE SUCCESS] Farmer Authenticated ID:", user._id.toString());

    next();
  } catch (error) {
    let message = error.message || "Unauthorized request";
    if (error.name === "TokenExpiredError") message = "Access token expired";
    if (error.name === "JsonWebTokenError") message = "Invalid access token";
    
    console.error("🔴 [MIDDLEWARE ERROR] JWT Verification Failed:", message);
    return next(new ApiError(401, message));
  }
});
