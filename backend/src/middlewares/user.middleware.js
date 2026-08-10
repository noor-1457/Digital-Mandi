//this will verify is the user is logged in or not
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import  User  from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // 1️⃣ Get token from cookie OR header
        const token = req.cookies?.accessToken || 
                      req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request - No token");
        }
        
        // 2️⃣ Verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // 3️⃣ ✅ FIX: Use userId (not _id)
        const user = await User.findById(decodedToken.userId)  
            .select("-password -refreshToken");
        
        if (!user) {
            throw new ApiError(401, "Unauthorized request - User not found");
        }
        
        // 4️⃣ Attach user to request
        req.user = user;
        next();
        
    } catch (error) {
        // Better error handling
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Access token expired");
        }
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid access token");
        }
        throw new ApiError(401, error.message || "Unauthorized request");
    }
});