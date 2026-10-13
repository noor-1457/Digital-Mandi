import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // Kis product ka review hai
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Kis buyer ne review kiya
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Kis order ke baad review kiya (taake ek order pe ek hi review ho)
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    // Kis farmer ka product tha (farmer ki average rating nikalne ke liye)
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Rating: 1 se 5 stars
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Review text (optional)
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  { timestamps: true },
);

// ✅ Ek order pe ek hi review ho sakta hai
// (buyer ek order ke liye ek hi baar review kar sakta hai)
reviewSchema.index({ orderId: 1, buyerId: 1 }, { unique: true });

// ✅ Product ke reviews jaldi dhoondhne ke liye
reviewSchema.index({ productId: 1, createdAt: -1 });

// ✅ Farmer ke reviews jaldi dhoondhne ke liye
reviewSchema.index({ farmerId: 1, createdAt: -1 });

export default mongoose.model("Review", reviewSchema);
