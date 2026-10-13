import express from "express";
import {
  createReview,
  getProductReviews,
  getProductRatingStats,
  getFarmerRatingStats,
  canReviewOrder,
} from "../controllers/reviewController.js";
import { verifyJWT } from "../middlewares/user.middleware.js";

const router = express.Router();

// ================= PUBLIC ROUTES =================
// Koi bhi product ke reviews dekh sakta hai (login zaroori nahi)
router.get("/product/:productId", getProductReviews);
router.get("/product/:productId/stats", getProductRatingStats);
router.get("/farmer/:farmerId/stats", getFarmerRatingStats);

// ================= PROTECTED ROUTES =================
// Review likhne ke liye login zaroori
router.post("/", verifyJWT, createReview);

// Check karein ke buyer review likh sakta hai ya nahi
router.get("/can-review/:orderId", verifyJWT, canReviewOrder);

export default router;