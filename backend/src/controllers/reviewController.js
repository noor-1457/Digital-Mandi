import Review from "../models/review.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

// ================= CREATE REVIEW =================
// Buyer review likhta hai (delivered order ke liye)
export const createReview = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { orderId, productId, rating, comment } = req.body;

    // ✅ Validation
    if (!orderId || !productId || !rating) {
      return res.status(400).json({
        message: "orderId, productId, and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1-5" });
    }

    // ✅ Order check karein
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Sirf delivered order pe review ho sakta hai
    if (order.status !== "delivered") {
      return res.status(400).json({
        message: "Only delivered orders can be reviewed",
      });
    }

    // ✅ Yeh order is buyer ka hi hai?
    if (order.buyerId.toString() !== buyerId.toString()) {
      return res.status(403).json({ message: "Not your order" });
    }

    // ✅ Product us order mein hai?
    const orderItem = order.items.find(
      (item) => item.productId.toString() === productId,
    );
    if (!orderItem) {
      return res.status(400).json({
        message: "This product is not in the order",
      });
    }

    // ✅ Pehle se review hai?
    const existingReview = await Review.findOne({ orderId, buyerId });
    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this order",
      });
    }

    // ✅ Product se farmer nikalein
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Review create karein
    const review = await Review.create({
      productId,
      buyerId,
      orderId,
      farmerId: product.farmer,
      rating: Number(rating),
      comment: comment || "",
    });

    // ✅ Buyer ki info populate karein response ke liye
    await review.populate("buyerId", "fullName");

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("createReview error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET PRODUCT REVIEWS =================
// Ek product ke saare reviews (public)
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate("buyerId", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("getProductReviews error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET PRODUCT RATING STATS =================
// Ek product ki average rating + total count
export const getProductRatingStats = async (req, res) => {
  try {
    const { productId } = req.params;

    const stats = await Review.aggregate([
      {
        $match: {
          productId: new mongoose.Types.ObjectId(productId), // ✅ FIX: mongoose direct use
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          // Har star ka count
          star5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
          star4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          star3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          star2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          star1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
        },
      },
    ]);

    const result = stats[0] || {
      averageRating: 0,
      totalReviews: 0,
      star5: 0,
      star4: 0,
      star3: 0,
      star2: 0,
      star1: 0,
    };

    res.status(200).json({
      success: true,
      averageRating: Number(result.averageRating?.toFixed(1)) || 0,
      totalReviews: result.totalReviews,
      breakdown: {
        5: result.star5,
        4: result.star4,
        3: result.star3,
        2: result.star2,
        1: result.star1,
      },
    });
  } catch (error) {
    console.error("getProductRatingStats error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET FARMER RATING STATS =================
// Ek farmer ki overall rating (saare products ka average)
export const getFarmerRatingStats = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const stats = await Review.aggregate([
      { $match: { farmerId: new mongoose.Types.ObjectId(farmerId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const result = stats[0] || { averageRating: 0, totalReviews: 0 };

    res.status(200).json({
      success: true,
      averageRating: Number(result.averageRating?.toFixed(1)) || 0,
      totalReviews: result.totalReviews,
    });
  } catch (error) {
    console.error("getFarmerRatingStats error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= CHECK IF BUYER CAN REVIEW ORDER =================
// Order detail page pe "Write Review" button dikhane ke liye
export const canReviewOrder = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.buyerId.toString() !== buyerId.toString()) {
      return res.status(403).json({ message: "Not your order" });
    }

    const existingReview = await Review.findOne({ orderId, buyerId });

    const canReview = order.status === "delivered" && !existingReview;

    res.status(200).json({
      success: true,
      canReview,
      alreadyReviewed: !!existingReview,
      review: existingReview || null,
    });
  } catch (error) {
    console.error("canReviewOrder error:", error);
    res.status(500).json({ message: error.message });
  }
};