import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // Kis user ko notification jayegi
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Notification ka type (order, message, system)
    type: {
      type: String,
      enum: ["order", "message", "system"],
      default: "system",
    },

    // Notification ka title aur message
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },

    // Kya user ne padh liya hai?
    isRead: {
      type: Boolean,
      default: false,
    },

    // Agar notification kisi order ya product se linked hai (optional)
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true },
);

// Fast query ke liye
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);